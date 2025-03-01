/// <reference lib="deno.ns" />

import { assertEquals } from "jsr:@std/assert";

import { Interpreter } from "./player.ts";
import { TimerElement } from "./types.ts";

Deno.test("Interpreter", async (t) => {
  await t.step("should interpret a simple timer", () => {
    const timer: TimerElement = {
      kind: "period",
      name: "Test",
      seconds: 5,
    };

    const interpreter = Interpreter.of(timer);

    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 5, text: "Test" },
      { kind: "speak", text: "Test" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 4, text: "Test" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 3, text: "Test" },
      { kind: "beep" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 2, text: "Test" },
      { kind: "beep" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 1, text: "Test" },
      { kind: "beep" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "finished" },
    ]);
  });

  await t.step("should interpret a sequence", () => {
    const timer: TimerElement = {
      kind: "sequence",
      elements: [
        { kind: "period", name: "First", seconds: 2 },
        { kind: "period", name: "Second", seconds: 3 },
      ],
    };

    const interpreter = Interpreter.of(timer);

    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 2, text: "First" },
      { kind: "speak", text: "First" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 1, text: "First" },
      { kind: "beep" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 3, text: "Second" },
      { kind: "speak", text: "Second" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 2, text: "Second" },
      { kind: "beep" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 1, text: "Second" },
      { kind: "beep" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "finished" },
    ]);
  });

  await t.step("should interpret a loop", () => {
    const timer: TimerElement = {
      kind: "loop",
      count: 3,
      element: { kind: "period", name: "Loop", seconds: 2 },
    };

    const interpreter = Interpreter.of(timer);

    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 2, text: "Loop" },
      { kind: "speak", text: "Loop" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 1, text: "Loop" },
      { kind: "beep" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 2, text: "Loop" },
      { kind: "speak", text: "Loop" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 1, text: "Loop" },
      { kind: "beep" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 2, text: "Loop" },
      { kind: "speak", text: "Loop" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "display", seconds: 1, text: "Loop" },
      { kind: "beep" },
    ]);
    assertEquals(interpreter.step(), [
      { kind: "finished" },
    ]);
  });
});
