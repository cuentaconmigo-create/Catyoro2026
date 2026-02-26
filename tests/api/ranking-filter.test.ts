import { describe, expect, it } from "vitest";

function filterNoGo<T extends { project: { isNogo: boolean } }>(items: T[], includeNogo: boolean) {
  return includeNogo ? items : items.filter((i) => !i.project.isNogo);
}

describe("ranking filter", () => {
  it("excluye No-Go por defecto", () => {
    const result = filterNoGo(
      [
        { project: { isNogo: false } },
        { project: { isNogo: true } }
      ],
      false
    );

    expect(result).toHaveLength(1);
  });
});
