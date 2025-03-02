import { AppState } from "./types.ts";

export const DEFAULT_APP_STATE: AppState = {
  presets: [
    {
      id: crypto.randomUUID(),
      name: "Carry No-hangs",
      root: {
        kind: "sequence",
        elements: [
          {
            kind: "period",
            name: "Prepare",
            seconds: 5,
          },
          {
            kind: "loop",
            count: 10,
            element: {
              kind: "sequence",
              elements: [
                {
                  kind: "period",
                  name: "Left",
                  seconds: 10,
                },
                {
                  kind: "period",
                  name: "Switch",
                  seconds: 3,
                },
                {
                  kind: "period",
                  name: "Right",
                  seconds: 10,
                },
                {
                  kind: "period",
                  name: "Rest",
                  seconds: 10,
                },
              ],
            },
          },
        ],
      },
    },
    {
      id: crypto.randomUUID(),
      name: "On-the-minute pull-ups",
      root: {
        kind: "sequence",
        elements: [
          {
            kind: "loop",
            count: 4,
            element: {
              kind: "sequence",
              elements: [
                {
                  kind: "period",
                  name: "Work",
                  seconds: 60,
                },
                {
                  kind: "period",
                  name: "Rest",
                  seconds: 60,
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
