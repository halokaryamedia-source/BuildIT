import { describe, expect, test } from "bun:test";
import {
  withTemporaryAnimationPreview,
  type AnimationPreviewPort,
} from "@/lib/animationPreviewState";

type FixtureAnimation = {
  name: string;
  selected?: boolean;
  playing?: boolean;
};

function fixture(previousPlaying = true) {
  const idle: FixtureAnimation = {
    name: "idle",
    selected: true,
    playing: previousPlaying,
  };
  const walk: FixtureAnimation = {
    name: "walk",
    selected: false,
    playing: false,
  };
  let selected: FixtureAnimation | null = idle;
  let previewCalls = 0;
  let defaultPoseCalls = 0;
  let effectsSuspended = false;

  const timeline = {
    time: 4,
    playing: true as boolean | undefined,
    setTime(value: number) {
      this.time = value;
    },
  };

  const port: AnimationPreviewPort<FixtureAnimation> = {
    animations: [idle, walk],
    timeline,
    getSelectedAnimation() {
      return selected;
    },
    setSelectedAnimation(animation) {
      selected = animation;
    },
    preview() {
      previewCalls += 1;
    },
    showDefaultPose() {
      defaultPoseCalls += 1;
    },
    suspendEffects() {
      effectsSuspended = true;
      return () => {
        effectsSuspended = false;
      };
    },
  };

  return {
    idle,
    walk,
    timeline,
    port,
    selected: () => selected,
    previewCalls: () => previewCalls,
    defaultPoseCalls: () => defaultPoseCalls,
    effectsSuspended: () => effectsSuspended,
  };
}

describe("temporary animation preview state", () => {
  test("poses one animation only inside observation and restores prior playing state", async () => {
    const state = fixture(true);

    const observed = await withTemporaryAnimationPreview(
      state.port,
      state.walk,
      0.75,
      () => ({
        selected: state.selected()?.name,
        idleSelected: state.idle.selected,
        idlePlaying: state.idle.playing,
        walkSelected: state.walk.selected,
        walkPlaying: state.walk.playing,
        time: state.timeline.time,
        timelinePlaying: state.timeline.playing,
        effectsSuspended: state.effectsSuspended(),
      })
    );

    expect(observed).toEqual({
      selected: "walk",
      idleSelected: false,
      idlePlaying: false,
      walkSelected: true,
      walkPlaying: true,
      time: 0.75,
      timelinePlaying: false,
      effectsSuspended: true,
    });

    expect(state.selected()).toBe(state.idle);
    expect(state.idle.selected).toBe(true);
    expect(state.idle.playing).toBe(true);
    expect(state.walk.selected).toBe(false);
    expect(state.walk.playing).toBe(false);
    expect(state.timeline.time).toBe(4);
    expect(state.timeline.playing).toBe(true);
    expect(state.effectsSuspended()).toBe(false);
    expect(state.previewCalls()).toBe(2);
    expect(state.defaultPoseCalls()).toBe(0);
  });

  test("restores state when observation throws", async () => {
    const state = fixture(true);

    await expect(
      withTemporaryAnimationPreview(
        state.port,
        state.walk,
        1.25,
        () => {
          throw new Error("capture failed");
        }
      )
    ).rejects.toThrow("capture failed");

    expect(state.selected()).toBe(state.idle);
    expect(state.idle.selected).toBe(true);
    expect(state.idle.playing).toBe(true);
    expect(state.walk.selected).toBe(false);
    expect(state.walk.playing).toBe(false);
    expect(state.timeline.time).toBe(4);
    expect(state.timeline.playing).toBe(true);
    expect(state.effectsSuspended()).toBe(false);
  });

  test("restores default pose when no animation was previously playing", async () => {
    const state = fixture(false);

    await withTemporaryAnimationPreview(
      state.port,
      state.walk,
      0.5,
      () => "captured"
    );

    expect(state.previewCalls()).toBe(1);
    expect(state.defaultPoseCalls()).toBe(1);
    expect(state.idle.playing).toBe(false);
    expect(state.walk.playing).toBe(false);
  });

  test("rejects invalid time or foreign target before changing state", async () => {
    const state = fixture(true);
    const foreign: FixtureAnimation = { name: "foreign" };

    await expect(
      withTemporaryAnimationPreview(
        state.port,
        state.walk,
        Number.NaN,
        () => "never"
      )
    ).rejects.toThrow();

    await expect(
      withTemporaryAnimationPreview(
        state.port,
        foreign,
        0,
        () => "never"
      )
    ).rejects.toThrow();

    expect(state.selected()).toBe(state.idle);
    expect(state.timeline.time).toBe(4);
    expect(state.previewCalls()).toBe(0);
    expect(state.effectsSuspended()).toBe(false);
  });
});
