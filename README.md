# FABRIQ site

## Local run

```bash
npx serve . -l 4173
```

## GitHub Pages deploy

- Repository: `fabriq`
- Branch: `main`
- Folder: `/ (root)`
- Site will be available under `/fabriq/` path on GitHub Pages.

## Paths rule (important)

- Use only relative paths in HTML/CSS/JS.
- Do **not** use absolute paths like `/assets/...`.
- Correct examples:
  - `assets/css/styles.css`
  - `../assets/js/script.js`
  - `../../assets/img/logo.png`
