import { AppState } from "./types.ts";

export const DEFAULT_APP_STATE: AppState = {
  preset: {
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
};
