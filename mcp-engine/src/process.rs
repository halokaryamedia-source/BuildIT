pub fn build_ollmcp_cmd(endpoint: &str) -> String {
    format!("uvx ollmcp -u {}", endpoint)
}
