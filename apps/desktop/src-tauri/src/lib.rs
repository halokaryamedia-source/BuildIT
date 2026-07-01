use serde::Serialize;
use std::{
  env,
  net::{SocketAddr, TcpStream},
  path::PathBuf,
  process::{Command, Stdio},
  time::Duration,
};

const REQUIRED_OLLAMA_MODELS: [&str; 2] = ["qwen3:8b", "qwen3-vl:4b"];
const MCP_PLUGIN_URL: &str = "https://achmadawdi.github.io/mcp-blockbench/mcp.js";

#[derive(Serialize)]
struct RuntimeStatus {
  engine_connected: bool,
  ollama_connected: bool,
  blockbench_mcp_port_open: bool,
  installed_ollama_models: Vec<String>,
  missing_ollama_models: Vec<String>,
}

#[derive(Serialize)]
struct RuntimeCommandResult {
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

fn repository_root() -> Result<PathBuf, String> {
  let current_dir = env::current_dir().map_err(|error| format!("Unable to read current directory: {error}"))?;

  if current_dir.join("package.json").exists() && current_dir.join("apps").exists() {
    return Ok(current_dir);
  }

  if current_dir.ends_with("apps/desktop") || current_dir.ends_with("apps\\desktop") {
    return current_dir
      .parent()
      .and_then(|apps_dir| apps_dir.parent())
      .map(PathBuf::from)
      .ok_or_else(|| "Unable to resolve repository root from apps/desktop.".to_string());
  }

  if current_dir.join("../../package.json").exists() {
    return current_dir
      .join("../..")
      .canonicalize()
      .map_err(|error| format!("Unable to canonicalize repository root: {error}"));
  }

  Ok(current_dir)
}

fn npm_command() -> &'static str {
  if cfg!(target_os = "windows") {
    "npm.cmd"
  } else {
    "npm"
  }
}

fn command_output(command: &str, args: &[&str]) -> Option<String> {
  Command::new(command)
    .args(args)
    .stdout(Stdio::piped())
    .stderr(Stdio::null())
    .output()
    .ok()
    .filter(|output| output.status.success())
    .map(|output| String::from_utf8_lossy(&output.stdout).to_string())
}

fn installed_ollama_models() -> Vec<String> {
  let Some(output) = command_output(if cfg!(target_os = "windows") { "ollama.exe" } else { "ollama" }, &["list"]) else {
    return Vec::new();
  };

  output
    .lines()
    .skip(1)
    .filter_map(|line| line.split_whitespace().next())
    .map(ToString::to_string)
    .collect()
}

fn missing_ollama_models(installed_models: &[String]) -> Vec<String> {
  REQUIRED_OLLAMA_MODELS
    .iter()
    .filter(|model| !installed_models.iter().any(|installed| installed == **model))
    .map(|model| model.to_string())
    .collect()
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

fn spawn_detached(command: &str, args: &[&str]) -> Result<(), String> {
  Command::new(command)
    .args(args)
    .stdin(Stdio::null())
    .stdout(Stdio::null())
    .stderr(Stdio::null())
    .spawn()
    .map(|_| ())
    .map_err(|error| format!("Unable to start {command}: {error}"))
}

#[tauri::command]
fn check_runtime() -> RuntimeStatus {
  let installed_models = installed_ollama_models();
  let missing_models = missing_ollama_models(&installed_models);

  RuntimeStatus {
    engine_connected: is_port_open(3987),
    ollama_connected: is_port_open(11434),
    blockbench_mcp_port_open: is_port_open(3000),
    installed_ollama_models: installed_models,
    missing_ollama_models: missing_models,
  }
}

#[tauri::command]
fn start_buildit_engine() -> Result<RuntimeCommandResult, String> {
  let root = repository_root()?;

  Command::new(npm_command())
    .args(["run", "dev:engine"])
    .current_dir(&root)
    .spawn()
    .map_err(|error| format!("Unable to start BuildIT engine: {error}"))?;

  Ok(RuntimeCommandResult {
    started: true,
    path: Some(root.to_string_lossy().to_string()),
    message: "BuildIT engine start command was sent.".to_string(),
  })
}

#[tauri::command]
fn start_ollama() -> Result<RuntimeCommandResult, String> {
  let command = if cfg!(target_os = "windows") { "ollama.exe" } else { "ollama" };
  spawn_detached(command, &["serve"])?;

  Ok(RuntimeCommandResult {
    started: true,
    path: Some(command.to_string()),
    message: "Ollama start command was sent.".to_string(),
  })
}

#[tauri::command]
fn pull_required_ollama_models() -> Result<RuntimeCommandResult, String> {
  if cfg!(target_os = "windows") {
    Command::new("powershell")
      .args([
        "-NoExit",
        "-Command",
        "ollama pull qwen3:8b; ollama pull qwen3-vl:4b; Read-Host 'BuildIT model pull finished. Press Enter to close'",
      ])
      .spawn()
      .map_err(|error| format!("Unable to start Ollama model pull: {error}"))?;
  } else {
    Command::new("sh")
      .args(["-c", "ollama pull qwen3:8b && ollama pull qwen3-vl:4b"])
      .spawn()
      .map_err(|error| format!("Unable to start Ollama model pull: {error}"))?;
  }

  Ok(RuntimeCommandResult {
    started: true,
    path: None,
    message: "Required Ollama model pull was started.".to_string(),
  })
}

#[tauri::command]
fn open_blockbench() -> Result<RuntimeCommandResult, String> {
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

  Ok(RuntimeCommandResult {
    started: true,
    path: Some(executable.to_string_lossy().to_string()),
    message: "Blockbench open command was sent.".to_string(),
  })
}

#[tauri::command]
fn open_mcp_plugin_page() -> Result<RuntimeCommandResult, String> {
  tauri_plugin_opener::open_url(MCP_PLUGIN_URL, None::<&str>).map_err(|error| format!("Unable to open MCP plugin page: {error}"))?;

  Ok(RuntimeCommandResult {
    started: true,
    path: Some(MCP_PLUGIN_URL.to_string()),
    message: "Blockbench MCP plugin page was opened.".to_string(),
  })
}

pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      check_runtime,
      start_buildit_engine,
      start_ollama,
      pull_required_ollama_models,
      open_blockbench,
      open_mcp_plugin_page
    ])
    .run(tauri::generate_context!())
    .expect("error while running BuildIT Tauri app");
}
