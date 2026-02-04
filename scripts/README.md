# Fabriq content pipeline

## Запуск

```bash
node scripts/content-pipeline.mjs
```

## Что делает

- Читает список источников из `data/sources.json`
- Пробует найти карточки стилей на страницах
- Скачивает доступные изображения в `assets/img/styles/<factory>/`
- Обновляет `data/styles.json`
- Пишет отчет в `data/pipeline-report.json`

## Когда нужен fallback

Если защита сайта или разметка мешают парсингу, используй ручной сценарий из `data/MANUAL_IMPORT_INSTRUCTIONS.md`.
