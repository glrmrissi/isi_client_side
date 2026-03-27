# isi-client-side

Angular web UI for browsing repositories pushed with the [`isi`](https://github.com/glrmrissi/isi) CLI. Connects to [`isi-object-storage`](https://github.com/glrmrissi/object_storage_isi) to list repositories, branches, and file trees — similar to how GitHub renders a repository.

## Features

- Browse all repositories pushed via `isi push`
- Navigate branches per repository
- File tree with folder navigation
- File viewer with line numbers

## Setup

**Requirements:** Node.js 20+, pnpm

```bash
git clone https://github.com/glrmrissi/isi_client_side
cd isi_client_side
pnpm install
pnpm start
```

Open `http://localhost:4200`. The app expects [`isi-object-storage`](https://github.com/glrmrissi/object_storage_isi) running at `http://localhost:3000`.

## Usage

```bash
# In any project with isi initialized:
isi init
isi add .
isi commit -m "first commit"
isi push   # repo name is auto-detected from the folder name

# Open http://localhost:4200 to browse it
```

## Stack

- **Angular 21** — standalone components, signals, built-in control flow (`@if`, `@for`)
- **Tailwind CSS 4** — styling
