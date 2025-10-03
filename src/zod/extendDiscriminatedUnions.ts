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
  Options extends Array<z.ZodDiscriminatedUnionOption<Discriminator>>,
>(
  discriminatedUnion: z.ZodDiscriminatedUnion<Discriminator, Options>,
  extendUnion: (
    value: z.ZodDiscriminatedUnionOption<Discriminator>,
  ) => z.ZodObject<ZodRawShape>,
): z.ZodDiscriminatedUnion<
  Discriminator,
  [
    z.ZodDiscriminatedUnionOption<Discriminator>,
    ...z.ZodDiscriminatedUnionOption<Discriminator>[],
  ]
> {
  const options = discriminatedUnion.options;
  const updatedOptions = Array.from(options).map((u) => extendUnion(u));

  return z.discriminatedUnion(
    discriminatedUnion.discriminator,
    updatedOptions as [
      ZodDiscriminatedUnionOption<Discriminator>,
      ...ZodDiscriminatedUnionOption<Discriminator>[],
    ],
  );
}
