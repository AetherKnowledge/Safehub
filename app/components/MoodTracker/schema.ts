import { MoodType } from "@/app/generated/prisma/browser";

export enum MoodEventType {
  MoodUpdated = "mood-updated",
  MoodAdded = "mood-added",
}

export type MoodEventUpdatedPayload =
  | {
      type: "broadcast";
      event: MoodEventType.MoodUpdated;
      payload: {
        oldMood: MoodType;
        newMood: MoodType;
      };
    }
  | {
      type: "broadcast";
      event: MoodEventType.MoodAdded;
      payload: {
        mood: MoodType;
      };
    };
