# giorgiopapitto.eu

A modern, minimalist personal website for Giorgio Papitto — cognitive neuroscientist
(language &amp; action). Static, dependency-free: just `index.html`, `styles.css`, `main.js`.

---

## How to preview it (no local setup needed)

You have a few options, from quickest to most "real":

### 1. Instant preview from this branch (fastest)
While the changes are on a branch (before merging), open them live with **raw.githack.com**:

```
https://raw.githack.com/giorgio-p-gaia/webistes/cursor/modern-minimalist-site-a9a4/index.html
```

This renders the real HTML + CSS + JS straight from the branch. No download, no build.

### 2. Preview on GitHub Pages (the eventual home)
Once this is merged to `main`:

1. Go to the repo on GitHub → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) deploys automatically on every
   push to `main`.
4. Your site goes live at: **https://giorgio-p-gaia.github.io/webistes/**

That URL is fully shareable and updates on every push — no local machine involved.

---

## Editing content

Everything is plain HTML, so you can edit it directly on GitHub (pencil icon on `index.html`):

- **Bio / intro** → the `hero` and `#about` sections.
- **Research** → the three `.card` blocks in `#research`.
- **Publications** → the `<li class="pub">` items in `#publications`.
- **CV** → the `#curriculum` section.
- **Contact** → the links in `#contact`. Search the file for `TODO(giorgio)` to fill in
  your real email and (optionally) ORCID.

### Re-skinning the look
Open `styles.css`. The top `:root { ... }` block holds all design tokens — change
`--accent`, the fonts, or spacing once and the whole site follows. A dark theme is built
in (toggle in the top-right; it remembers your choice and respects your OS setting).

---

## Migrating from Google Sites → GitHub Pages (giorgiopapitto.eu)

Your domain is registered at **GoDaddy** and currently points at **Google Sites**. To move
it to GitHub Pages:

### Step 1 — Get the site live on GitHub Pages
Do the GitHub Pages setup above (Settings → Pages → Source: GitHub Actions). Confirm it
works at `https://giorgio-p-gaia.github.io/webistes/`.

### Step 2 — Tell GitHub about your custom domain
In **Settings → Pages → Custom domain**, enter `giorgiopapitto.eu` and save. This creates a
`CNAME` file in the repo. (You can also add the file yourself: a single line containing
`giorgiopapitto.eu`.)

### Step 3 — Point GoDaddy DNS at GitHub
In GoDaddy → your domain → **DNS / Manage DNS**, replace the existing Google records with
GitHub's:

**Apex domain (`giorgiopapitto.eu`)** — create four `A` records:

| Type | Name | Value           |
|------|------|-----------------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |

(Optionally also add the IPv6 `AAAA` records: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
`2606:50c0:8002::153`, `2606:50c0:8003::153`.)

**`www` subdomain** — create one `CNAME` record:

| Type  | Name | Value                       |
|-------|------|-----------------------------|
| CNAME | www  | giorgio-p-gaia.github.io    |

Remove the old Google Sites verification / hosting records once you've confirmed the new
ones resolve. DNS changes can take from a few minutes up to ~48 hours to propagate.

### Step 4 — Turn on HTTPS
Back in **Settings → Pages**, wait for the domain check to pass, then tick
**Enforce HTTPS**. Done — `https://giorgiopapitto.eu` now serves this site.

> Tip: keep Google Sites untouched until GitHub Pages is confirmed working on the custom
> domain, so there's no downtime. Only delete the Google site afterwards.
