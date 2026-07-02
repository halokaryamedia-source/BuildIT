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
        let plugin_enabled = if reachable {
            check_plugin_health(&url).await
        } else {
            false
        };

        probes.push(EndpointProbe {
            url,
            port,
            reachable,
            plugin_enabled,
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

async fn check_plugin_health(url: &str) -> bool {
    let request = reqwest::Client::new().get(url);
    let response = timeout(Duration::from_millis(300), request.send())
        .await
        .ok()
        .and_then(|result| result.ok());

    match response {
        Some(resp) => {
            let status = resp.status().as_u16();
            status >= 200 && status < 500 && status != 404
        }
        None => false,
    }
}
