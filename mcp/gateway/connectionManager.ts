import { ReconnectPolicy } from "./reconnectPolicy";
import { RuntimeSessionState } from "./runtimeSession";

export class GatewayConnectionManager {
  readonly reconnect = new ReconnectPolicy({
    minBackoffMs: Number(process.env.BLOCKIT_GATEWAY_RECONNECT_MIN_MS ?? 250),
    maxBackoffMs: Number(process.env.BLOCKIT_GATEWAY_RECONNECT_MAX_MS ?? 5_000),
  });
  readonly session = new RuntimeSessionState();

  beginProbe(): void {
    this.session.transition("probing");
  }

  beginConnect(): void {
    this.session.transition("connecting");
  }

  markReady(options: { reconnected?: boolean; catalogRefreshed?: boolean } = {}): void {
    if (options.reconnected) this.session.markReconnect();
    if (options.catalogRefreshed) this.session.markCatalogRefresh();
    this.reconnect.markSuccess();
    this.session.transition("ready");
  }

  markOffline(): number {
    this.session.transition("offline");
    return this.reconnect.markFailure();
  }

  markDegraded(): number {
    this.session.transition("degraded");
    return this.reconnect.markFailure();
  }

  snapshot() {
    return {
      ...this.session.snapshot(),
      reconnect: this.reconnect.snapshot(),
    };
  }
}
