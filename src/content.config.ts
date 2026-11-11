import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Один універсальний тип блоку замість discriminatedUnion:
 * у zod v4 в Astro 6 дискриміновані юніони ламають генерацію JSON-схеми.
 * Зайві поля для конкретного типу просто ігноруються рендерером.
 */
const pageBlock = z.object({
  type: z.string(),
  title: z.string().optional(),
  intro: z.string().optional(),
  text: z.string().optional(),
  source: z.string().optional(),
  label: z.string().optional(),
  body: z.array(z.string()).optional(),
  items: z
    .array(
      z.union([
        z.string(),
        z.object({
          title: z.string().optional(),
          text: z.string().optional(),
          href: z.string().optional(),
          linkLabel: z.string().optional(),
          src: z.string().optional(),
          alt: z.string().optional(),
          caption: z.string().optional(),
        }),
      ])
    )
    .optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    eyebrow: z.string().optional(),
    lead: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    heroImageNote: z.string().optional(),
    blocks: z.array(pageBlock).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    summary: z.string(),
    needs: z.array(z.string()).default([]),
    duration: z.string().optional(),
    price: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageNote: z.string().optional(),
    needsReview: z.boolean().default(true),
  }),
});

export const collections = { pages, services };
