use std::sync::{Arc, Mutex};

use mcp_engine::{collect_environment_report, codex_http_config, codex_mcp_remote_config, is_local_endpoint};
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::{Child, Command};

#[derive(Default)]
struct BridgeState {
    child: Option<Child>,
    endpoint: Option<String>,
    mode: Option<String>,
    logs: Vec<String>,
}

#[derive(Clone)]
struct AppState {
    bridge: Arc<Mutex<BridgeState>>,
}

#[derive(serde::Serialize)]
struct EnvironmentPayload {
    endpoints: Vec<mcp_engine::EndpointProbe>,
    uvx: mcp_engine::DependencyStatus,
    ollama: mcp_engine::DependencyStatus,
    selected_endpoint: String,
}

#[derive(serde::Serialize)]
struct BridgeStatus {
    running: bool,
    endpoint: Option<String>,
    mode: Option<String>,
    logs: Vec<String>,
}

#[tauri::command]
async fn detect_environment() -> Result<EnvironmentPayload, String> {
    let report = collect_environment_report().await;

    Ok(EnvironmentPayload {
        endpoints: report.endpoints,
        uvx: report.uvx,
        ollama: report.ollama,
        selected_endpoint: report.selected_endpoint,
    })
}

#[tauri::command]
async fn start_bridge(
    app: AppHandle,
    state: State<'_, AppState>,
    endpoint: String,
) -> Result<String, String> {
    if !is_local_endpoint(&endpoint) {
        return Err("Remote endpoint blocked by default for safety.".to_string());
    }

    let (stdout, stderr) = {
        let mut guard = state.bridge.lock().map_err(|_| "state lock failure".to_string())?;
        if guard.child.is_some() {
            return Err("Bridge already running".to_string());
        }

        let mut child = Command::new("uvx")
            .arg("ollmcp")
            .arg("-u")
            .arg(&endpoint)
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
            .map_err(|err| format!("Failed to start uvx ollmcp: {}", err))?;

        let out = child.stdout.take();
        let err = child.stderr.take();

        guard.endpoint = Some(endpoint.clone());
        guard.mode = Some("ollama".to_string());
        guard.logs.push(format!("Started bridge at {}", endpoint));
        guard.child = Some(child);

        (out, err)
    };

    if let Some(out) = stdout {
        forward_stream(&app, state.bridge.clone(), out, false);
    }
    if let Some(err) = stderr {
        forward_stream(&app, state.bridge.clone(), err, true);
    }

    Ok(endpoint)
}

#[tauri::command]
async fn stop_bridge(state: State<'_, AppState>) -> Result<bool, String> {
    let mut guard = state.bridge.lock().map_err(|_| "state lock failure".to_string())?;

    if let Some(mut child) = guard.child.take() {
        let _ = child.kill().await;
        let _ = child.wait().await;
        guard.endpoint = None;
        guard.mode = None;
        guard.logs.push("Bridge stopped".to_string());
        return Ok(true);
    }

    Ok(false)
}

#[tauri::command]
fn get_ollmcp_command_text(endpoint: String) -> String {
    format!("uvx ollmcp -u {}", endpoint)
}

#[tauri::command]
fn prepare_codex_config(endpoint: String) -> (String, String) {
    (
        codex_http_config(&endpoint),
        codex_mcp_remote_config(&endpoint),
    )
}

#[tauri::command]
fn bridge_status(state: State<'_, AppState>) -> Result<BridgeStatus, String> {
    let guard = state.bridge.lock().map_err(|_| "state lock failure".to_string())?;

    Ok(BridgeStatus {
        running: guard.child.is_some(),
        endpoint: guard.endpoint.clone(),
        mode: guard.mode.clone(),
        logs: guard.logs.clone(),
    })
}

fn forward_stream<R>(app: &AppHandle, state: Arc<Mutex<BridgeState>>, stream: R, is_error: bool)
where
    R: tokio::io::AsyncRead + Send + Unpin + 'static,
{
    let app_handle = app.clone();
    let state = state.clone();
    tokio::spawn(async move {
        let mut reader = BufReader::new(stream).lines();
        loop {
            match reader.next_line().await {
                Ok(Some(raw_line)) => {
                    let line = if is_error {
                        format!("ERR: {}", raw_line)
                    } else {
                        raw_line
                    };

                    if let Ok(mut guard) = state.lock() {
                        guard.logs.push(line.clone());
                        if guard.logs.len() > 400 {
                            let overflow = guard.logs.len().saturating_sub(400);
                            guard.logs.drain(0..overflow);
                        }
                    }

                    let _ = app_handle.emit("bridge-log", &line);
                }
                _ => break,
            }
        }
    });
}

fn main() {
    let state = AppState {
        bridge: Arc::new(Mutex::new(BridgeState::default())),
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            detect_environment,
            start_bridge,
            stop_bridge,
            bridge_status,
            get_ollmcp_command_text,
            prepare_codex_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
