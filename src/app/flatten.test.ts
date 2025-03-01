/// <reference lib="deno.ns" />

import { assertEquals } from "jsr:@std/assert";

import { flatten } from "./flatten.ts";

Deno.test("flatten", async (t) => {
  await t.step("should flatten a simple timer", () => {
    const root = {
      kind: "sequence",
      elements: [
        { kind: "period", name: "Test", seconds: 5 },
      ],
    } as const;

    assertEquals(flatten(root), [
      {
        contexts: [
          { kind: "sequence", source: root, index: 0 },
        ],
        source: root.elements[0],
      },
    ]);
  });

  await t.step("should flatten a sequence", () => {
    const root = {
      kind: "sequence",
      elements: [
        { kind: "period", name: "First", seconds: 2 },
        { kind: "period", name: "Second", seconds: 3 },
      ],
    } as const;

    assertEquals(flatten(root), [
      {
        contexts: [
          { kind: "sequence", source: root, index: 0 },
        ],
        source: root.elements[0],
      },
      {
        contexts: [
          { kind: "sequence", source: root, index: 1 },
        ],
        source: root.elements[1],
      },
    ]);
  });

  await t.step("should flatten a nested sequence", () => {
    const root = {
      kind: "sequence",
      elements: [
        { kind: "period", name: "First", seconds: 2 },
        {
          kind: "sequence",
          elements: [
            { kind: "period", name: "Second", seconds: 3 },
          ],
        },
      ],
    } as const;

    assertEquals(flatten(root), [
      {
        contexts: [
          { kind: "sequence", source: root, index: 0 },
        ],
        source: root.elements[0],
      },
      {
        contexts: [
          { kind: "sequence", source: root, index: 1 },
          { kind: "sequence", source: root.elements[1], index: 0 },
        ],
        source: root.elements[1].elements[0],
      },
    ]);
  });

  await t.step("should flatten a loop", () => {
    const root = {
      kind: "loop",
      count: 3,
      element: {
        kind: "period",
        name: "Test",
        seconds: 5,
      },
    } as const;

    assertEquals(flatten(root), [
      {
        contexts: [
          { kind: "loop", source: root, iteration: 0 },
        ],
        source: root.element,
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 1 },
        ],
        source: root.element,
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 2 },
        ],
        source: root.element,
      },
    ]);
  });

  await t.step("should flatten a nested loop", () => {
    const root = {
      kind: "loop",
      count: 2,
      element: {
        kind: "loop",
        count: 3,
        element: {
          kind: "period",
          name: "Test",
          seconds: 5,
        },
      },
    } as const;

    assertEquals(flatten(root), [
      {
        contexts: [
          { kind: "loop", source: root, iteration: 0 },
          { kind: "loop", source: root.element, iteration: 0 },
        ],
        source: root.element.element,
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 0 },
          { kind: "loop", source: root.element, iteration: 1 },
        ],
        source: root.element.element,
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 0 },
          { kind: "loop", source: root.element, iteration: 2 },
        ],
        source: root.element.element,
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 1 },
          { kind: "loop", source: root.element, iteration: 0 },
        ],
        source: root.element.element,
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 1 },
          { kind: "loop", source: root.element, iteration: 1 },
        ],
        source: root.element.element,
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 1 },
          { kind: "loop", source: root.element, iteration: 2 },
        ],
        source: root.element.element,
      },
    ]);
  });

  await t.step("should flatten a sequence inside a loop", () => {
    const root = {
      kind: "loop",
      count: 2,
      element: {
        kind: "sequence",
        elements: [
          { kind: "period", name: "First", seconds: 2 },
          { kind: "period", name: "Second", seconds: 3 },
        ],
      },
    } as const;

    assertEquals(flatten(root), [
      {
        contexts: [
          { kind: "loop", source: root, iteration: 0 },
          { kind: "sequence", source: root.element, index: 0 },
        ],
        source: root.element.elements[0],
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 0 },
          { kind: "sequence", source: root.element, index: 1 },
        ],
        source: root.element.elements[1],
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 1 },
          { kind: "sequence", source: root.element, index: 0 },
        ],
        source: root.element.elements[0],
      },
      {
        contexts: [
          { kind: "loop", source: root, iteration: 1 },
          { kind: "sequence", source: root.element, index: 1 },
        ],
        source: root.element.elements[1],
      },
    ]);
  });
});
