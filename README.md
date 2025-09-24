# Мини‑каталог автомобилей

`Тестовое задание` - Алексей Юрин
Можно ознакомиться с примером [по ссылке](https://intex.yurin.dev)

## Описание проделанной работы

- Локальный JSON с 16 авто в [app/assets/data/cars.json](app/assets/data/cars.json)
  (_один специально с ошибкой_).
- Список автомобилей и карточка ТС:
  - Страница списка: `app/components/cars/List.vue`
    \+ рендер превью `app/components/cars/Preview.vue`.
  - Страница карточки: `app/components/cars/Full/Card.vue`
    (_+ секции `Full/Line.vue`, `Full/Section.vue`, `Full/Trim.vue`_).
- Локальный поиск по **make** и **model** (**+ по году**): поисковая строка `app/components/cars/Search.vue`, логика фильтрации в `List.vue`.
- Фильтры и быстрые подсказки: `app/stores/searchStore.ts` + `app/components/SearchSuggestions.vue`.
- Внешний API CarQuery для расширенной информации о ТС: серверный маршрут `server/api/getCarMoreInfo.post.ts`.
- Дополнительное API для изображений (сердито, но бесплатно): Wikimedia API в `server/api/getCarImg.post.ts`. (_без токена 100 запросов в минуту если не ошибаюсь_)
- Динамическая загрузка расширенных данных при открытии карточки (`useAsyncData` в `Full/Card.vue`).
- Состояния загрузки и ошибок: визуальные статусы в `Full/Card.vue` (pending / нет данных).
- Переходы между страницами: Nuxt маршруты `pages/index.vue`, `pages/car-[id].vue`.
- Pinia для хранения данных: `app/stores/carsStore.ts`, `app/stores/searchStore.ts`; включено persistent‑хранилище через `pinia-plugin-persistedstate` (sessionStorage), настройка в `nuxt.config.ts`.
- SSR + SPA и отдельные сборки: скрипты `build:ssr` и `build:spa` в `package.json`.
- TypeScript: типы авто `types/index.d.ts`, типизация стора, компонентов и API.
- Линтеры/форматтеры: ESLint + Prettier, Tailwind плагин Prettier.

## Дополнительно

1. Создал енам с иконками `app/constants/icons.ts`
2. Горячая клавиша для фокуса поиска: Cmd/Ctrl + F (`Search.vue`).
3. Выбор понравившихся характеристик в карточке (клик по строкам `Full/Line.vue`).
4. Хранение расширенных данных и фотографий в Pinia для предотвращения повторных запросов.

## Структура проекта (ключевые файлы)

```bash
- app/
  - assets/
  - data/
    - cars.json # локальные данные
  - components/
    - SearchSuggestions.vue # список подсказок/фильтров
  - cars/
    - List.vue # список автомобилей с фильтрацией
    - Preview.vue # карточка превью автомобиля
    - Search.vue # поисковая строка
    - Full/
      - Card.vue # страница карточки авто
      - Line.vue # строка характеристики
      - Section.vue # обертка секции карточки
      - Trim.vue # рендер отдельных тримов
  - constants/
    - icons.ts # enum с иконками Iconify
  - layouts/
    - default.vue # шапка, глобальный поиск, кнопка назад/домой
  - pages/
    - index.vue # список
    - car-[id].vue # карточка авто
  - stores/
    - carsStore.ts # данные авто, фото, тримы (persist)
    - searchStore.ts # поиск, фильтры, подсказки (persist)
  - composables/
    - useCarsApi.ts # клиент для серверных API (фото/тримы)
- server/
  - api/
    - getCarImg.post.ts # Wikimedia API proxy
    - getCarMoreInfo.post.ts # CarQuery API proxy
- types/
  - index.d.ts
```

## Как запустить

> [!tip] Bun
> Я использую Bun как менеджер пакетов, команды совместимы с остальными

Требования: Node 18+, pnpm/npm/bun.

Разработка (SSR):

```bash
pnpm install
pnpm dev
```

Сборка SSR и предпросмотр:

```bash
pnpm build:ssr
pnpm preview
```

Сборка SPA:

```bash
pnpm build:spa
```

Форматирование кода:

```bash
pnpm pret
```

## Автор

[Алексей Юрин](https://t.me/holyxey)
