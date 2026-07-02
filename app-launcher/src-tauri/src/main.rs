use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};

use mcp_engine::{
    collect_environment_report,
    codex_http_config,
    codex_mcp_remote_config,
    is_local_endpoint,
};
use tauri::{AppHandle, Emitter, State};
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
    has_blockbench_endpoint: bool,
    blockbench_message: String,
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
        has_blockbench_endpoint: report.has_blockbench_endpoint,
        blockbench_message: report.blockbench_message,
    })
}

#[tauri::command]
async fn start_bridge(
    app: AppHandle,
    state: State<'_, AppState>,
    endpoint: String,
    allow_remote: bool,
) -> Result<String, String> {
    let endpoint = endpoint.trim().to_string();

    if endpoint.is_empty() {
        return Err("Endpoint cannot be empty.".to_string());
    }

    if !is_local_endpoint(&endpoint) && !allow_remote {
        return Err("Remote endpoint blocked by default. Enable explicit confirmation to continue.".to_string());
    }

    let mut guard = state
        .bridge
        .lock()
        .map_err(|_| "state lock failure".to_string())?;

    if guard.child.is_some() {
        return Err("Bridge already running".to_string());
    }

    let command = mcp_engine::process::build_ollmcp_command(&endpoint);
    let mut child = Command::new(&command[0])
        .args(&command[1..])
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|err| format!("Failed to start uvx ollmcp: {}", err))?;

    let child_stdout = child.stdout.take();
    let child_stderr = child.stderr.take();

    guard.endpoint = Some(endpoint.clone());
    guard.mode = Some("ollama".to_string());
    guard.logs.push(format!("Started bridge at {}", endpoint));
    guard.child = Some(child);
    drop(guard);

    if let Some(stdout) = child_stdout {
        forward_stream(&app, state.bridge.clone(), stdout, false);
    }
    if let Some(stderr) = child_stderr {
        forward_stream(&app, state.bridge.clone(), stderr, true);
    }

    Ok(endpoint)
}

#[tauri::command]
async fn stop_bridge(state: State<'_, AppState>) -> Result<bool, String> {
    let mut guard = state
        .bridge
        .lock()
        .map_err(|_| "state lock failure".to_string())?;

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
fn bridge_status(state: State<'_, AppState>) -> Result<BridgeStatus, String> {
    let guard = state
        .bridge
        .lock()
        .map_err(|_| "state lock failure".to_string())?;

    Ok(BridgeStatus {
        running: guard.child.is_some(),
        endpoint: guard.endpoint.clone(),
        mode: guard.mode.clone(),
        logs: guard.logs.clone(),
    })
}

#[tauri::command]
fn prepare_codex_config(endpoint: String) -> (String, String) {
    (codex_http_config(&endpoint), codex_mcp_remote_config(&endpoint))
}

#[tauri::command]
fn get_ollmcp_command_text(endpoint: String) -> String {
    format!("uvx ollmcp -u {}", endpoint)
}

#[tauri::command]
fn get_default_codex_path() -> String {
    default_codex_path().to_string_lossy().to_string()
}

#[tauri::command]
fn write_codex_config(
    endpoint: String,
    use_remote_fallback: bool,
    allow_write: bool,
    target_path: Option<String>,
) -> Result<String, String> {
    if !allow_write {
        return Err("Write blocked: user confirmation required.".to_string());
    }

    let path = target_path
        .map(PathBuf::from)
        .unwrap_or_else(default_codex_path);

    let parent = path
        .parent()
        .filter(|dir| !dir.as_os_str().is_empty())
        .unwrap_or_else(|| Path::new("."));

    fs::create_dir_all(parent)
        .map_err(|err| format!("Could not prepare config directory: {}", err))?;

    let content = if use_remote_fallback {
        codex_mcp_remote_config(&endpoint)
    } else {
        codex_http_config(&endpoint)
    };

    fs::write(&path, content.as_bytes())
        .map_err(|err| format!("Could not write config: {}", err))?;

    Ok(path.to_string_lossy().to_string())
}

fn default_codex_path() -> PathBuf {
    env::var_os("APPDATA")
        .map(PathBuf::from)
        .or_else(|| dirs::home_dir().map(|h| h.join(".codex")))
        .unwrap_or_else(|| PathBuf::from(".").join(".codex"))
        .join("config.toml")
}

fn forward_stream<R>(app: &AppHandle, state: Arc<Mutex<BridgeState>>, stream: R, is_error: bool)
where
    R: tokio::io::AsyncRead + Send + Unpin + 'static,
{
    let app_handle = app.clone();
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
            get_default_codex_path,
            write_codex_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
