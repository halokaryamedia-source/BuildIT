use std::time::Duration;
use tokio::net::TcpStream;
use tokio::time::timeout;

use crate::EndpointProbe;

pub fn endpoint_from_port(port: u16) -> String {
    format!("http://localhost:{}/bb-mcp", port)
}

pub async fn scan_local_endpoints() -> Vec<EndpointProbe> {
    let mut probes = Vec::new();

    for port in crate::SCAN_START_PORT..=crate::SCAN_END_PORT {
        let url = endpoint_from_port(port);
        let reachable = is_port_reachable(port).await;
        probes.push(EndpointProbe {
            url,
            port,
            reachable,
        });
    }

    probes
}

pub async fn is_port_reachable(port: u16) -> bool {
    let address = ("127.0.0.1", port);
    timeout(Duration::from_millis(220), TcpStream::connect(address))
        .await
        .map(|stream| stream.is_ok())
        .unwrap_or(false)
}
