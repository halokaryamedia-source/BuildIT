use serde::Serialize;
use std::{
  env,
  net::{SocketAddr, TcpStream},
  path::PathBuf,
  process::Command,
  time::Duration,
};

#[derive(Serialize)]
struct RuntimeStatus {
  ollama_connected: bool,
  blockbench_mcp_port_open: bool,
}

#[derive(Serialize)]
struct OpenProcessResult {
  started: bool,
  path: Option<String>,
  message: String,
}

fn is_port_open(port: u16) -> bool {
  let address = SocketAddr::from(([127, 0, 0, 1], port));
  TcpStream::connect_timeout(&address, Duration::from_millis(700)).is_ok()
}

fn user_home() -> Option<PathBuf> {
  env::var_os("USERPROFILE")
    .or_else(|| env::var_os("HOME"))
    .map(PathBuf::from)
}

fn blockbench_candidates() -> Vec<PathBuf> {
  let mut candidates = Vec::new();

  if cfg!(target_os = "windows") {
    if let Some(home) = user_home() {
      candidates.push(home.join("AppData/Local/Programs/Blockbench/Blockbench.exe"));
    }
    candidates.push(PathBuf::from("C:/Program Files/Blockbench/Blockbench.exe"));
    candidates.push(PathBuf::from("C:/Program Files (x86)/Blockbench/Blockbench.exe"));
  } else if cfg!(target_os = "macos") {
    candidates.push(PathBuf::from("/Applications/Blockbench.app"));
  } else {
    candidates.push(PathBuf::from("/usr/bin/blockbench"));
    candidates.push(PathBuf::from("/usr/local/bin/blockbench"));
  }

  candidates
}

#[tauri::command]
fn check_runtime() -> RuntimeStatus {
  RuntimeStatus {
    ollama_connected: is_port_open(11434),
    blockbench_mcp_port_open: is_port_open(3000),
  }
}

#[tauri::command]
fn start_ollama() -> Result<OpenProcessResult, String> {
  let command = if cfg!(target_os = "windows") { "ollama.exe" } else { "ollama" };
  Command::new(command)
    .arg("serve")
    .spawn()
    .map_err(|error| format!("Unable to start Ollama: {error}"))?;

  Ok(OpenProcessResult {
    started: true,
    path: Some(command.to_string()),
    message: "Ollama start command was sent.".to_string(),
  })
}

#[tauri::command]
fn open_blockbench() -> Result<OpenProcessResult, String> {
  let candidates = blockbench_candidates();
  let executable = candidates
    .iter()
    .find(|candidate| candidate.exists())
    .cloned()
    .ok_or_else(|| "Blockbench executable was not found in common install locations.".to_string())?;

  if cfg!(target_os = "macos") && executable.extension().and_then(|value| value.to_str()) == Some("app") {
    Command::new("open")
      .arg(&executable)
      .spawn()
      .map_err(|error| format!("Unable to open Blockbench: {error}"))?;
  } else {
    Command::new(&executable)
      .spawn()
      .map_err(|error| format!("Unable to open Blockbench: {error}"))?;
  }

  Ok(OpenProcessResult {
    started: true,
    path: Some(executable.to_string_lossy().to_string()),
    message: "Blockbench open command was sent.".to_string(),
  })
}

pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![check_runtime, start_ollama, open_blockbench])
    .run(tauri::generate_context!())
    .expect("error while running BuildIT Tauri app");
}
