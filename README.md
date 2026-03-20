# RiftMaster

App companion per i giocatori di **Riftbound TCG** — catalogo carte, gestione collezione, deck builder e companion di partita.

Disponibile come web app e nativa su iOS/Android tramite Capacitor.

---

## Stack

- **React 19** + **TypeScript 5.9** + **Vite 8**
- **TanStack Router** (file-based routing) + **TanStack Query 5**
- **TanStack Form** + **Zod 4**
- **HeroUI 2** + **Tailwind CSS v4** + **Framer Motion**
- **Supabase** (database + auth, schema `rift_master`)
- **Capacitor 8** (iOS + Android)
- **Biome** (lint + format)

---

## Prerequisiti

- [Bun](https://bun.sh) >= 1.x
- Account [Supabase](https://supabase.com) con schema `rift_master`

---

## Setup

```bash
# Installa le dipendenze
bun install

# Configura le variabili d'ambiente
cp .env.example .env
# → modifica VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# Avvia in dev
bun run dev
```

---

## Script disponibili

| Comando | Descrizione |
|---|---|
| `bun run dev` | Avvia il dev server |
| `bun run build` | Build di produzione |
| `bun run preview` | Anteprima della build |
| `bun run check` | Lint + format con Biome |
| `bun run cap:sync` | Build + sync Capacitor (Android) |
| `bun run cap:open` | Apre il progetto in Android Studio |

---

## Variabili d'ambiente

Crea un file `.env` nella root del progetto:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

---

## Struttura del progetto

```
src/
  main.tsx               # entry point — router + query provider
  index.css              # global CSS (@import "tailwindcss")
  database.types.ts      # tipi generati da Supabase CLI
  routes/
    __root.tsx           # layout root con bottom nav
    index.tsx            # home "/"
    cards/
      index.tsx          # lista carte con filtri e scroll infinito
  components/
    cards/               # CardItem, CardFilters
  queries/
    cards.ts             # queryOptions per carte, set, rarità, ecc.
  types/
    card.ts              # CardWithDetails, CardFilters
  integration/
    supabase.ts          # client Supabase tipizzato
    query-client.ts      # istanza QueryClient
```

---

## Roadmap

Vedi [ROADMAP.md](./ROADMAP.md) per il piano di sviluppo completo.

---

## Licenza

Distribuito sotto licenza [MIT](./LICENSE.txt). Copyright (c) 2025 Lorenzo Bonatti.
