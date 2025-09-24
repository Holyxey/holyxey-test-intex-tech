# Мини‑каталог автомобилей

Небольшое Nuxt 4 приложение для просмотра списка автомобилей с локальными данными и догрузкой расширенной информации и изображений с внешних API.

— Стек: Nuxt 4 (Vue 3, Vite), Pinia (persist), TypeScript, Tailwind CSS 4, ESLint + Prettier, Iconify.

## Что реализовано

- Локальные данные о 15 авто в `app/assets/data/cars.json` (id, make, model, year).
  > _Специально сделана ошибка у X5 для демонстрации_
- Страница списка с предпросмотром карточек и локальным поиском по make/model/year.
- Страница карточки авто с догрузкой:
  - характеристик через CarQuery API (`getTrims`),
  - изображения через Wikimedia Commons API.
- Состояния загрузки и отсутствия данных в карточке.
- Кеширование фото и доп.информации в Pinia c persistent‑хранилищем (sessionStorage) — повторные запросы не выполняются.
- SSR и SPA сборки отдельными скриптами: `build:ssr` и `build:spa` (управляется переменной `NUXT_SSR`).
- Локальный серверный API (Nuxt server routes) для проксирования внешних запросов и добавления заголовков/корс:
  - `POST /api/getCarMoreInfo` — данные из CarQuery,
  - `POST /api/getCarImg` — поиск фото в Wikimedia.
- Типизация через `types/` (`CarInfo`).
- Линтер и форматирование: `@nuxt/eslint`, Prettier + плагин для Tailwind.

## Что не реализовано / известно

- Фильтры на странице списка (из «доп. плюсов») — отсутствуют, реализован только текстовый поиск.
- Сохранение выбранных фильтров в URL — частично: сохраняется строка поиска (ключи `list` и `card` для разных страниц).
- Тесты — отсутствуют.

## Быстрый старт

Требуется Node.js 18+ (или Bun). В репозитории есть `bun.lock`, поэтому ниже указаны оба варианта.

Установка зависимостей:

```bash
# npm
npm i

# или bun
bun install
```

Запуск разработки (http://localhost:3000):

```bash
npm run dev
# или
bun run dev
```

Сборка и предпросмотр:

```bash
# SSR
npm run build:ssr && npm run preview

# SPA
npm run build:spa && npm run preview

# Статическая генерация
npm run generate
```

Переменные окружения (используются для корректного User‑Agent при запросах к Wikimedia API):

```bash
API_NAME="CarCatalog"
API_MAIL="you@example.com"
```

Можно задать через `.env` или перед командой запуска.

## Где что лежит

- Данные: `app/assets/data/cars.json` — локальная база авто.
- Типы: `types/index.d.ts` — `CarInfo`.
- Хранилища:
  - `app/stores/carsStore.ts` — массив авто, фото и «trims»; persist: true.
  - `app/stores/searchStore.ts` — значение поиска, синхронизация с URL.
- Компоненты списка: `app/components/cars/`
  - `List.vue` — вывод списка и фильтрация,
  - `Preview.vue` — карточка в гриде,
  - `Search.vue` — поле поиска в layout.
- Карточка авто: `app/components/cars/Full/`
  - `Card.vue` — страница карточки (через `pages/car-[id].vue`),
  - `Section.vue`, `Line.vue`, `Trim.vue` — блоки UI.
- Маршруты страниц: `app/pages/index.vue`, `app/pages/car-[id].vue`.
- Компоузабл: `app/composables/useCarsApi.ts` — обращение к серверным эндпоинтам, кеш в Pinia.
- Серверные эндпоинты (Nuxt server routes):
  - `server/api/getCarMoreInfo.post.ts`
  - `server/api/getCarImg.post.ts`
- Конфигурация: `nuxt.config.ts` (модули, SSR/SPA, Tailwind, runtimeConfig).

## Поиск и сохранение запроса

- Поиск регистронезависимый, по подстроке (RegExp) в полях `make`, `model`, `year`.
- Значение ввода синхронизируется с URL:
  - на странице списка — параметр `?list=`
  - на странице карточки — параметр `?card=`
- Состояние поиска хранится в Pinia и переживает навигацию в рамках сессии (sessionStorage).

## Внешние API и CORS

- CarQuery: `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=...&year=...&model=...`
- Wikimedia Commons: поиск и получение файла для фото.
- В серверных маршрутах включена проверка CORS. Разрешённые источники:
  - `http://localhost:3000`
  - `https://intex.yurin.dev`
  - `https://cloudflared.holyxey.com`

При развёртывании на другом домене добавьте его в массив `origins` в файлах API.

## Команды

```bash
# Разработка
npm run dev

# Сборка по умолчанию
npm run build

# Отдельные сборки
npm run build:ssr
npm run build:spa

# Предпросмотр собранного
npm run preview

# Генерация статики
npm run generate

# Форматирование
npm run pret
```

## Известные ограничения

- Опечатка в `cars.json` у года для BMW X5 (20119). Для корректности работы CarQuery стоит заменить на `2019`.
- Внешние API могут ограничивать частоту запросов; в таком случае фото/«trims» могут не догружаться мгновенно.
- Persist хранилища активен в пределах одной сессии (sessionStorage).

## Автор

[Алексей Юрин](https://t.me/holyxey)
