import { z } from "zod";
import { extendDiscriminatedUnions } from "./extendDiscriminatedUnions";

describe("extendDiscriminatedUnions", () => {
  const A = z.object({ type: z.literal("a"), value: z.string() });
  const B = z.object({ type: z.literal("b"), value: z.number() });
  const union = z.discriminatedUnion("type", [A, B]);

  it("should extend all options with an additional property", () => {
    const extendedUnion = extendDiscriminatedUnions(union, (option) =>
      option.extend({ extra: z.boolean() }),
    );

    expect(
      extendedUnion.parse({ type: "a", value: "foo", extra: true }),
    ).toEqual({ type: "a", value: "foo", extra: true });

    expect(extendedUnion.parse({ type: "b", value: 42, extra: false })).toEqual(
      { type: "b", value: 42, extra: false },
    );
  });

  it("should throw if required properties are missing", () => {
    const extendedUnion = extendDiscriminatedUnions(union, (option) =>
      option.extend({ extra: z.boolean() }),
    );

    expect(() => extendedUnion.parse({ type: "a", value: "foo" })).toThrow();
    expect(() => extendedUnion.parse({ type: "b", extra: true })).toThrow();
  });
});
