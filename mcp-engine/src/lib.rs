pub mod endpoint;
pub mod process;

pub const DEFAULT_MCP_ENDPOINT: &str = "http://localhost:3000/bb-mcp";
pub const SCAN_START_PORT: u16 = 3000;
pub const SCAN_END_PORT: u16 = 3010;

pub fn version() -> &'static str {
    "BlockIT MCP Bridge Runtime"
}

#[derive(Debug, Clone)]
pub struct BridgeConfig {
    pub endpoint: String,
    pub mode: String,
}

impl Default for BridgeConfig {
    fn default() -> Self {
        Self {
            endpoint: DEFAULT_MCP_ENDPOINT.to_string(),
            mode: "ollama".to_string(),
        }
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct EndpointProbe {
    pub url: String,
    pub port: u16,
    pub reachable: bool,
    pub plugin_enabled: bool,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct DependencyStatus {
    pub name: String,
    pub installed: bool,
    pub message: String,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct EnvironmentReport {
    pub endpoints: Vec<EndpointProbe>,
    pub uvx: DependencyStatus,
    pub ollama: DependencyStatus,
    pub selected_endpoint: String,
    pub has_blockbench_endpoint: bool,
    pub blockbench_message: String,
}

pub async fn collect_environment_report() -> EnvironmentReport {
    let endpoints = endpoint::scan_local_endpoints().await;
    let active = endpoints.iter().find(|probe| probe.plugin_enabled);
    let selected_endpoint = active
        .map(|probe| probe.url.clone())
        .or_else(|| endpoints.iter().find(|probe| probe.reachable).map(|probe| probe.url.clone()))
        .unwrap_or_else(|| DEFAULT_MCP_ENDPOINT.to_string());

    let has_blockbench_endpoint = endpoints.iter().any(|probe| probe.plugin_enabled);
    let blockbench_message = if has_blockbench_endpoint {
        "Blockbench MCP endpoint found. Ensure MCP plugin is enabled for the selected Blockbench window.".to_string()
    } else {
        "No active Blockbench MCP endpoint detected. Open Blockbench, enable the MCP plugin, and keep MCP window active.".to_string()
    };

    EnvironmentReport {
        endpoints,
        uvx: process::check_uvx_dependency().await,
        ollama: process::check_ollama_dependency().await,
        selected_endpoint,
        has_blockbench_endpoint,
        blockbench_message,
    }
}

pub fn codex_http_config(endpoint: &str) -> String {
    format!(
        "[mcp_servers.blockbench]\nurl = \"{}\"\n",
        endpoint.trim()
    )
}

pub fn codex_mcp_remote_config(endpoint: &str) -> String {
    format!(
        "[mcp_servers.blockbench]\ncommand = \"npx\"\nargs = [\"mcp-remote\", \"{}\"]\n",
        endpoint.trim()
    )
}

pub fn warn_if_remote_endpoint(url: &str) -> bool {
    !url.starts_with("http://localhost:") && !url.starts_with("https://localhost:")
}
