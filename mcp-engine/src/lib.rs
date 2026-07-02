pub mod endpoint;
pub mod process;

pub fn version() -> &\'static str {
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
            endpoint: "http://localhost:3000/bb-mcp".to_string(),
            mode: "ollama".to_string(),
        }
    }
}
