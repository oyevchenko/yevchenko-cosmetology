import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { withBase } from './site';

export type PageEntry = CollectionEntry<'pages'>;
export type ServiceEntry = CollectionEntry<'services'>;

export async function getPage(id: string): Promise<PageEntry> {
  const entry = await getEntry('pages', id);
  if (!entry) {
    throw new Error(`Немає контенту сторінки: src/content/pages/${id}.json`);
  }
  return entry;
}

export async function getServices(): Promise<ServiceEntry[]> {
  const all = await getCollection('services');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export const serviceHref = (id: string) => withBase(`/posluhy/${id}/`);

export async function getFeaturedServices(limit = 4): Promise<ServiceEntry[]> {
  const all = await getServices();
  const featured = all.filter((s) => s.data.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export const pageTitle = (entry: PageEntry) =>
  entry.data.seoTitle || `${entry.data.title} — YEVCHENKO COSMETOLOGY`;
