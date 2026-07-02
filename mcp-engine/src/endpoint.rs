pub fn detect_endpoints() -> Vec<String> {
    (3000..=3010).map(|port| format!("http://localhost:{}/bb-mcp", port)).collect()
}
