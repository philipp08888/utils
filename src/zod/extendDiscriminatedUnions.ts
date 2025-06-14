import { z, ZodDiscriminatedUnionOption, ZodRawShape } from "zod";

/**
 * Returns a new discriminated union schema where each option of the original union
 * is extended by the provided callback.
 *
 * @param discriminatedUnion The original Zod discriminated union schema.
 * @param extendUnion A function that receives each option and returns an extended schema.
 * @returns A new Zod discriminated union schema with all options extended.
 */
export function extendDiscriminatedUnions<
  Discriminator extends string,
  Options extends Array<z.ZodDiscriminatedUnionOption<Discriminator>>
>(
  discriminatedUnion: z.ZodDiscriminatedUnion<Discriminator, Options>,
  extendUnion: (
    value: z.ZodDiscriminatedUnionOption<Discriminator>
  ) => z.ZodObject<ZodRawShape>
) {
  const options = discriminatedUnion.optionsMap;
  // optionsMap loses type info, so we assert the correct generic type here.
  // Safe because all options come from the same discriminatedUnion.
  const updatedOptions = Array.from(options).map(([_, v]) =>
    extendUnion(v as z.ZodDiscriminatedUnionOption<Discriminator>)
  );

  return z.discriminatedUnion(
    discriminatedUnion.discriminator,
    updatedOptions as [
      ZodDiscriminatedUnionOption<Discriminator>,
      ...ZodDiscriminatedUnionOption<Discriminator>[]
    ]
  );
}
