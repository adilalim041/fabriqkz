# Manual fallback for styles pipeline

Если автоматический парсинг не смог собрать карточки стилей:

1. Открой `data/styles.json`.
2. Добавь объект стиля в нужный раздел (`zov` или `geosideal`) по шаблону:

```json
{
  "slug": "new-style-slug",
  "title": "Название стиля",
  "description": "Краткое описание",
  "image": "assets/img/styles/<factory>/<file>.jpg",
  "page": "styles/<factory>/<new-style-slug>.html",
  "sourceUrl": "https://..."
}
```

3. Скачай 1-3 фото вручную в `assets/img/styles/<factory>/`.
4. Создай HTML-страницу стиля по аналогии с существующими файлами в `styles/`.
5. Добавь карточку стиля на:
   - `styles.html`
   - `factories/<factory>.html`

Скрипт пишет отчет в `data/pipeline-report.json`.
