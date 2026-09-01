export const PBR_MATERIAL_CHANNELS = ["color", "normal", "height", "mer"] as const;
export type PbrMaterialChannel = (typeof PBR_MATERIAL_CHANNELS)[number];

export type PbrMaterialTextureState = {
  uuid: string;
  group: string;
  pbr_channel: string;
};

export type PbrMaterialTextureChange = {
  uuid: string;
  group: string;
  pbr_channel: string;
};

export type PbrMaterialMembershipPlan = {
  changes: PbrMaterialTextureChange[];
  affected_group_uuids: string[];
};

function requireUniqueTextureStates(
  states: readonly PbrMaterialTextureState[],
  context: string
): void {
  const seen = new Set<string>();
  for (const state of states) {
    if (!state.uuid) {
      throw new Error(`${context} contains a texture with an empty UUID.`);
    }
    if (seen.has(state.uuid)) {
      throw new Error(`${context} contains duplicate texture UUID ${state.uuid}.`);
    }
    seen.add(state.uuid);
  }
}

function channelsConflict(
  requested: PbrMaterialChannel,
  existing: string
): boolean {
  if (requested === existing) return true;
  return (
    (requested === "normal" && existing === "height") ||
    (requested === "height" && existing === "normal")
  );
}

/**
 * Plans one material-channel assignment without mutating runtime Texture state.
 * A material may own one texture per semantic channel, and normal/height are
 * mutually exclusive because Bedrock texture_set uses one depth source.
 */
export function planExclusivePbrMaterialAssignment(
  states: readonly PbrMaterialTextureState[],
  targetGroupUuid: string,
  incomingTextureUuid: string,
  channel: PbrMaterialChannel,
  context: string
): PbrMaterialMembershipPlan {
  if (!targetGroupUuid) {
    throw new Error(`${context} requires a non-empty target material UUID.`);
  }
  requireUniqueTextureStates(states, context);

  const incoming = states.find((state) => state.uuid === incomingTextureUuid);
  if (!incoming) {
    throw new Error(
      `${context} incoming texture ${incomingTextureUuid} is not present in the supplied texture state.`
    );
  }

  const desiredByUuid = new Map<string, PbrMaterialTextureChange>();
  const affectedGroups = new Set<string>([targetGroupUuid]);
  if (incoming.group && incoming.group !== targetGroupUuid) {
    affectedGroups.add(incoming.group);
  }

  for (const state of states) {
    let desiredGroup = state.group;
    let desiredChannel = state.pbr_channel;

    if (state.uuid === incomingTextureUuid) {
      desiredGroup = targetGroupUuid;
      desiredChannel = channel;
    } else if (
      state.group === targetGroupUuid &&
      channelsConflict(channel, state.pbr_channel)
    ) {
      desiredGroup = "";
    }

    if (
      desiredGroup !== state.group ||
      desiredChannel !== state.pbr_channel
    ) {
      desiredByUuid.set(state.uuid, {
        uuid: state.uuid,
        group: desiredGroup,
        pbr_channel: desiredChannel,
      });
    }
  }

  return {
    changes: [...desiredByUuid.values()],
    affected_group_uuids: [...affectedGroups].sort(),
  };
}

export function requireExclusivePbrMaterialState(
  states: readonly PbrMaterialTextureState[],
  groupUuid: string,
  context: string
): void {
  requireUniqueTextureStates(states, context);
  const grouped = states.filter((state) => state.group === groupUuid);
  const counts = new Map<string, number>();
  for (const state of grouped) {
    counts.set(state.pbr_channel, (counts.get(state.pbr_channel) ?? 0) + 1);
  }

  for (const channel of PBR_MATERIAL_CHANNELS) {
    if ((counts.get(channel) ?? 0) > 1) {
      throw new Error(`${context} has multiple ${channel} textures in one material.`);
    }
  }

  if ((counts.get("normal") ?? 0) > 0 && (counts.get("height") ?? 0) > 0) {
    throw new Error(`${context} cannot contain both normal and height textures.`);
  }
}
