use tokio::process::Command;
use tokio::time::{timeout, Duration};

use crate::DependencyStatus;

const COMMAND_TIMEOUT: Duration = Duration::from_millis(1_200);

pub fn build_ollmcp_command(endpoint: &str) -> Vec<String> {
    vec![
        "uvx".to_string(),
        "ollmcp".to_string(),
        "-u".to_string(),
        endpoint.to_string(),
    ]
}

pub fn build_ollmcp_command_text(endpoint: &str) -> String {
    build_ollmcp_command(endpoint).join(" ")
}

pub fn is_local_endpoint(endpoint: &str) -> bool {
    endpoint.starts_with("http://localhost:") || endpoint.starts_with("https://localhost:")
}

pub async fn check_uvx_dependency() -> DependencyStatus {
    command_available_status("uvx").await
}

pub async fn check_ollama_dependency() -> DependencyStatus {
    let probe = command_available_status("ollama").await;
    if !probe.installed {
        return DependencyStatus {
            name: "ollama".to_string(),
            installed: false,
            message: "ollama command not found".to_string(),
        };
    }

    match probe_command_with_args("ollama", &["--version"]).await {
        true => DependencyStatus {
            name: "ollama".to_string(),
            installed: true,
            message: "ollama is available".to_string(),
        },
        false => DependencyStatus {
            name: "ollama".to_string(),
            installed: false,
            message: "ollama exists but no response".to_string(),
        },
    }
}

pub async fn command_available_status(command_name: &str) -> DependencyStatus {
    match command_exists(command_name).await {
        true => DependencyStatus {
            name: command_name.to_string(),
            installed: true,
            message: format!("{} is available", command_name),
        },
        false => DependencyStatus {
            name: command_name.to_string(),
            installed: false,
            message: format!("{} is not found in PATH", command_name),
        },
    }
}

#[cfg(windows)]
async fn command_exists(name: &str) -> bool {
    let mut command = Command::new("where");
    command.arg(name);
    command
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null());

    let result = timeout(COMMAND_TIMEOUT, command.status())
        .await
        .map(|status| status.map(|s| s.success()).unwrap_or(false))
        .unwrap_or(false);

    result
}

#[cfg(not(windows))]
async fn command_exists(name: &str) -> bool {
    let expr = format!("command -v {}", name);
    let mut command = Command::new("sh");
    command.args(["-c", &expr]);
    command
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null());

    let result = timeout(COMMAND_TIMEOUT, command.status())
        .await
        .map(|status| status.map(|s| s.success()).unwrap_or(false))
        .unwrap_or(false);

    result
}

async fn probe_command_with_args(cmd: &str, args: &[&str]) -> bool {
    let mut command = Command::new(cmd);
    command.args(args);
    command
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null());

    timeout(COMMAND_TIMEOUT, command.status())
        .await
        .map(|status| status.map(|s| s.success()).unwrap_or(false))
        .unwrap_or(false)
}
