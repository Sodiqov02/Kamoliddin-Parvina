# GitHub Pages — проверка и подготовка

Проверено 29 октября 2026 года. Рабочая ветка `redesign-november-2026` совпадала с `origin/redesign-november-2026` на коммите `4dcca4f`; PR [№ 1](https://github.com/Sodiqov02/Kamoliddin-Parvina/pull/1) открыт к `main`, GitHub сообщает `MERGEABLE`. Текущие исправления находятся в локальной рабочей папке и ещё не включены в PR.

## Почему открыт 404

1. Проверка `https://sodiqov02.github.io/Kamoliddin-Parvina/` вернула HTTP 404. В API Pages источник — **Deploy from a branch**, `main`, `/`, `build_type: legacy`. Последняя автоматическая Jekyll-сборка источника успешно завершилась на `46cbfe1`, но корень этой версии содержит исходники Next.js и не содержит `index.html`. Это объясняет 404: сам исходный код не является готовым статическим сайтом.
2. Новая версия находится в ветке PR и в `main` пока не попала. Поэтому она не могла появиться на Pages через текущий источник.
3. Последние два запуска собственного workflow `Deploy GitHub Pages` завершились до старта runner: шагов нет, в аннотации GitHub указано: **“The job was not started because your account is locked due to a billing issue.”** Это подтверждено для запусков [32879125150](https://github.com/Sodiqov02/Kamoliddin-Parvina/actions/runs/32879125150) и [32858797046](https://github.com/Sodiqov02/Kamoliddin-Parvina/actions/runs/32858797046). Точное финансовое основание и то, сохраняется ли блокировка сейчас, API запусков не раскрывает; новый запуск здесь не инициировался.
4. Для предложенной публикации из собственного workflow настройка Source должна быть **GitHub Actions**. Сейчас она остаётся в режиме публикации из ветки. Это подтверждается настройками Pages и [документацией GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Защита окружения `github-pages` разрешает развёртывание только из `main`. Последняя проверка PR также показывала успешный Vercel preview и неуспешный Cloudflare Pages preview. Подробности ошибки Cloudflare через GitHub не получены; это отдельная интеграция и не доказанная причина отказа GitHub Pages.

## Подготовленные изменения

- `.github/workflows/deploy-pages.yml`: отдельная сборка для PR и main; сначала тесты, сборка, подготовка и проверка артефакта, затем загрузка `dist/client`. Шаг deploy зависит от сборки и разрешён только при событии не `pull_request` и ссылке `refs/heads/main`. Права `pages: write` и `id-token: write` ограничены job публикации. Группы concurrency разделены по событию и ветке.
- `scripts/pages-base.mjs` и `scripts/prepare-pages.mjs`: единое вычисление base path из `GITHUB_REPOSITORY` или `PAGES_BASE_PATH`; повторная подготовка больше не удваивает префикс.
- `scripts/validate-pages.mjs`: проверка статического артефакта, `.nojekyll`, индексной страницы, ссылок CSS/JS, шрифтов, фотографии, favicon, OG и `.ics`.
- `scripts/verify-pages.mjs`: изолированная свежая копия артефакта и локальная проверка реальных HTTP-запросов под `/Kamoliddin-Parvina/`, включая создание персонального приглашения, раскрытие конверта, CSS, JS, шрифты, фотографию, OG, favicon и скачивание `.ics`.
- `tests/pages-prepare.test.mjs` и `package.json`: тесты base path для project/user site и повторной подготовки. Дизайн не менялся.

## Локальные проверки

- На Node **22.23.4**, соответствующем major-версии workflow: `npm test` — 8 тестов, `npm run build`, `npm run pages:prepare`, `node scripts/validate-pages.mjs` — успешно.
- `npm ci --dry-run --ignore-scripts` на Node 22 в отдельной временной папке с копиями `package.json` и `package-lock.json` прошёл; фактическую чистую установку и установочные скрипты этот dry run не проверяет.
- Локальная проверка подготовленной сборки под `/Kamoliddin-Parvina/`: `PAGES_OK`. Убедились в загрузке реальных файлов; проверка не публиковала сайт.
- ESLint и TypeScript: `SOURCE_OK`. YAML workflow прочитан локальным парсером; проверены условие `deploy` и зависимость от сборки.
- Сборка выводит предупреждения плагинов о sourcemap и разделении модулей, но завершается успешно. `npm ci` в свежем GitHub-hosted runner в рамках этой проверки не запускался; работоспособность workflow на GitHub пока не подтверждена.

Для повторения локально:

```powershell
Set-Location 'Z:\projects\kamoliddin parvina'
$env:GITHUB_REPOSITORY = 'Sodiqov02/Kamoliddin-Parvina'
cmd /c npm test
cmd /c npm run build
cmd /c npm run pages:prepare
node scripts/validate-pages.mjs
node scripts/verify-pages.mjs
```

После подготовки `dist/client` рассчитан на `/Kamoliddin-Parvina/`; для обычного локального preview в корне следует пересобрать его без этого шага.

## Что требуется до публикации

1. Владелец аккаунта проверяет billing/status GitHub Actions и устраняет блокировку, если она сохраняется. Нельзя заключить из старой аннотации, что проблема точно сохраняется сейчас или что требуется платный тариф.
2. Проверить и отправить эти локальные исправления в PR; повторный запуск PR-проверки не выполняет job `deploy`, хотя другие подключённые сервисы могут создавать preview после push.
3. В Settings → Pages выбрать **GitHub Actions** как Source; проверить, что окружение `github-pages` разрешает `main`. Изменение удалённых настроек здесь не выполнялось. Эти действия и последующее развёртывание требуют согласования с владельцем.
4. Только после отдельного разрешения на merge и публикацию объединить проверенный PR в `main`. Push в `main` запускает новый workflow и автоматически пытается опубликовать сайт. Проверить успешность `build` и `deploy`, затем HTTP 200 страницы, фотографию, шрифты, скрипты, `.ics` и социальное превью на реальном Pages URL.

Не выполнялись push, изменение Pages settings, merge, workflow dispatch или публикация.
