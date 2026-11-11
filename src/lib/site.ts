import siteJson from '../content/site.json';

export const site = siteJson;
export const contacts = siteJson.contacts;
export const specialist = siteJson.specialist;

/** Позначка для даних, яких ще немає. Не вигадуємо ціни, адреси, графіки. */
export const TODO = '[уточнити у спеціаліста]';

export const isTodo = (value?: string | null): boolean =>
  !value || !value.trim() || value.trim() === TODO;

/** Показує значення або помітний плейсхолдер. */
export const orTodo = (value?: string | null): string =>
  isTodo(value) ? TODO : (value as string).trim();

export const instagramUrl = contacts.instagramUrl?.trim() || '';
export const telegramUrl = contacts.telegramUrl?.trim() || '';
export const mapUrl = contacts.mapUrl?.trim() || '';

/**
 * Prefix an internal path with Astro's base (needed for GitHub Pages project sites).
 * Leaves absolute http(s), mailto, tel, and protocol-relative URLs unchanged.
 */
export function withBase(path = '/'): string {
  if (/^(https?:|mailto:|tel:|\/\/)/i.test(path)) return path;

  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;

  const hashIndex = path.indexOf('#');
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  const pathname = hashIndex >= 0 ? path.slice(0, hashIndex) : path;

  if (!pathname || pathname === '/') return hash ? `${prefix.slice(0, -1) || '/'}${hash}` : prefix;

  if (pathname === prefix.slice(0, -1) || pathname === prefix || pathname.startsWith(prefix)) {
    return `${pathname}${hash}`;
  }

  const clean = pathname.replace(/^\//, '');
  return `${prefix}${clean}${hash}`;
}

export const contactHref = withBase('/kontakty/');

/** Основна кнопка «Записатися»: Telegram, інакше Instagram, інакше сторінка контактів. */
export const bookingHref = telegramUrl || instagramUrl || withBase('/kontakty/#zapys');
export const bookingIsExternal = Boolean(telegramUrl || instagramUrl);

/** Абсолютна адреса для canonical / OG. */
export const absoluteUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  const origin = (import.meta.env.SITE || 'https://oyevchenko.github.io').replace(/\/$/, '');
  return new URL(withBase(path), `${origin}/`).toString();
};
