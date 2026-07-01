import { BlockbenchMcpClient } from "../mcp/blockbench-client.js";

export interface SyncState {
  connected: boolean;
  endpoint: string;
  checkedAt: string;
}

export class SyncManager {
  constructor(private readonly client: BlockbenchMcpClient, private readonly endpoint: string) {}

  async getState(): Promise<SyncState> {
    const connected = await this.client.health();
    return {
      connected,
      endpoint: this.endpoint,
      checkedAt: new Date().toISOString()
    };
  }
}
