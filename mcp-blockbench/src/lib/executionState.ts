export interface ExecutionProfileState {
  profileId: string;
  profileRevision: number;
  profileHash: string;
}

let current: ExecutionProfileState = {
  profileId: "UNINITIALIZED",
  profileRevision: 0,
  profileHash: "",
};

export function setExecutionProfileState(next: ExecutionProfileState): void {
  current = { ...next };
}

export function getExecutionProfileState(): ExecutionProfileState {
  return { ...current };
}
