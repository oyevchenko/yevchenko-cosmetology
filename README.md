# YEVCHENKO COSMETOLOGY

Сайт приватного косметологічного кабінету в Києві (Поділ). Статичний сайт на **Astro 6 + Tailwind CSS 4**, контент — у JSON / Markdown, редагується без правок коду (Decap CMS або вручну).

## Швидкий старт

Потрібен **Node.js ≥ 22.12** (Astro 6 не працює на Node 20).

```bash
# у цій системі Node 24 лежить локально:
export PATH="$HOME/.local/node24/bin:$PATH"

npm install
npm run dev        # http://localhost:4321
npm run build      # збірка в dist/
npm run preview    # перегляд зібраного сайту
```

Щоб `node` був доступний завжди, додайте рядок у `~/.zshrc`:

```bash
export PATH="$HOME/.local/node24/bin:$PATH"
```

## Структура

```
src/
  content/
    site.json            ← КОНТАКТИ, навігація, SEO, графік, аналітика
    pages/*.json         ← тексти сторінок (блоки)
    services/*.md        ← 11 сторінок послуг
  content.config.ts      ← схема контенту
  layouts/BaseLayout.astro
  components/            ← хедер, футер, кнопки, блоки, картки
  pages/                 ← маршрути
  styles/global.css      ← палітра, шрифти, базові стилі
public/
  images/uploads/        ← завантажені фото (CMS)
  admin/                 ← Decap CMS (/admin)
```

Маршрути: `/`, `/pro-mene/`, `/posluhy/`, `/posluhy/<slug>/` (11 сторінок), `/biologique-recherche/`, `/dmk/`, `/domashnii-dohliad/`, `/kontakty/`, `404`.

## Як редагувати контент

### Варіант 1 — через адмінку (Decap CMS)

Адмінка доступна за `/admin/` після деплою з Netlify + Netlify Identity (див. нижче). Локально:

```bash
npx decap-server          # у першому терміналі
npm run dev               # у другому
# відкрити http://localhost:4321/admin/
```

У CMS є три розділи:

- **Налаштування сайту** — контакти, навігація, графік, SEO.
- **Послуги** — файли в `src/content/services/`.
- **Сторінки** — блоки сторінок у `src/content/pages/`.

### Варіант 2 — вручну

Усі тексти — звичайні JSON/Markdown. Після правок достатньо `npm run dev` (гаряче перезавантаження) або нового `npm run build`.

**Блоки сторінок** (`src/content/pages/*.json`) мають поле `type`: `text`, `cards`, `list`, `steps`, `gallery`, `note`, `quote`, `cta`. Блоки можна переставляти, додавати й видаляти.

## Фото

Зараз усі зображення — стилізовані заглушки (градієнт + підпис «Фото · замінити»). Щоб поставити справжнє фото:

1. Покладіть файл у `public/images/uploads/` (або завантажте через CMS).
2. У відповідному полі вкажіть шлях: `heroImage`, `image`, або `items[].src` у галереях.
3. Alt-текст — обов'язково заповніть (`heroImageAlt`, `imageAlt`, `alt`).

Контакти/соцмережі не є фото — вони в `site.json`.

## Позначки TODO

Дані, яких ще немає, показуються на сайті як **`[уточнити у спеціаліста]`**. Це свідоме рішення: ціни, тривалість, адреса, протоколи не вигадані.

Що заповнити перед запуском (усе у `src/content/site.json`, окрім останніх пунктів):

- [x] `site.url` — `https://oyevchenko.github.io/yevchenko-cosmetology`
- [ ] `contacts.instagramUrl` + `instagramHandle`
- [ ] `contacts.telegramUrl` + `telegramHandle`
- [ ] `contacts.phone` та `phoneDisplay`
- [ ] `contacts.addressFull`, `mapUrl`, `mapEmbedUrl`
- [ ] `schedule.rows` — графік роботи (`note` прибрати)
- [ ] `site.ogImage` — власна OG-картинка (зараз генерується `/og-default.png`)
- [ ] `analytics.*` — після погодження з власницею

Окремо:

- [ ] `public/robots.txt` — замінити домен у `Sitemap:`
- [ ] ціни й тривалість у `src/content/services/*.md` (`price`, `duration`)
- [ ] погодити зі спеціалісткою тексти протоколів (у кожній послузі стоїть примітка «чернетка»)
- [ ] фото: портрет, кабінет, процедури, продукти Biologique Recherche та DMK
- [ ] логотип і фірмові матеріали (зараз — текстовий логотип)
- [ ] реквізити практики (ФОП/клініка) на сторінці контактів

## Деплой

Збірка — статична (`dist/`), без серверного коду.

### Netlify (рекомендовано, бо дає Decap CMS з коробки)

1. Підключіть репозиторій; build command — `npm run build`, publish directory — `dist`.
2. Увімкніть **Identity** і **Git Gateway** (Site settings → Identity).
3. Запросіть власницю як Identity-користувача — вона заходитиме на `/admin/`.

### Vercel

Build command `npm run build`, output `dist`. Для CMS потрібен окремий OAuth-провайдер або перехід на `backend: github` у `public/admin/config.yml`.

### Cloudflare Pages

Build command `npm run build`, output directory `dist`. CMS — так само потрібен OAuth (Decap підтримує Cloudflare Workers-проксі).

Після деплою: задайте домен, увімкніть HTTPS (автоматично на всіх трьох), оновіть `site.url` і `robots.txt`, перевірте `sitemap-index.xml`.

## Що вже працює

- адаптивний layout (mobile-first) із фіксованою кнопкою запису на мобільному;
- кнопки «Записатися» в хедері, на головній, у кожній послузі, у футері;
- SEO: унікальні `title`/`description`, canonical, OG/Twitter, `sitemap-index.xml`, JSON-LD (`HealthAndBeautyBusiness`, `Person`, `Service`, `ItemList`);
- Alt-тексти і заглушки замість фото;
- читання контенту з колекцій, схема з валідацією;
- 404, `robots.txt`, favicon, OG-картинка.

## Технічні деталі

- Node 24, Astro 6, Tailwind 4 через **PostCSS** (`@tailwindcss/postcss`) — плагін `@tailwindcss/vite` несумісний із Vite у Astro 6.
- Контент-колекції: `glob`-лоадер, схема в `src/content.config.ts`. `discriminatedUnion` не використовується (ламає генерацію схеми в zod v4) — блоки описані одним об'єктом із полем `type`.
- `trailingSlash: 'always'`, `build.format: 'directory'` — усі внутрішні посилання зі слешем.
- Шрифти підключені локально через Fontsource (Cormorant Garamond + Manrope), кирилиця включена.
