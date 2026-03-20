# RiftMaster — Roadmap di Sviluppo

## Presentazione

RiftMaster è l'app companion per i giocatori di **Riftbound TCG**. Accessibile su web e nativa su mobile (iOS/Android tramite Capacitor), offre un'esperienza completa per consultare carte, gestire la propria collezione e affrontare le partite con il massimo supporto digitale.

Il database è sincronizzato con i dati ufficiali di Riftbound e con i prezzi live di CardTrader per tutte le regioni.

---

## Obiettivi

- **Consultazione carte** — navigazione rapida del catalogo completo con filtri avanzati
- **Gestione collezione** — tieni traccia delle carte possedute, wishlist, duplicati
- **Prezzi di mercato** — visualizzazione prezzi CardTrader per regione (min/avg) per ogni carta
- **Deck Builder** — costruisci e salva i tuoi mazzi, verifica legalità e statistiche
- **Companion di partita** — life tracker, turno, stato risorse durante le partite
- **Profilo utente** — account con sincronizzazione cloud di tutte le liste
- **Condivisione** — condividi collezioni, wishlist e mazzi con altri giocatori

---

## Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| Frontend | React 19, TypeScript 5.9, Vite 8 |
| UI Components | HeroUI 2, Framer Motion |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query 5 |
| Form | TanStack Form + Zod 4 |
| Styling | Tailwind CSS v4 |
| Icone | FontAwesome Free |
| Backend/DB | Supabase (schema `rift_master`) |
| Auth | Supabase Auth |
| Native | Capacitor 8 (iOS + Android) |
| Linting | Biome |

---

## Step di Sviluppo

### Fase 1 — Fondamenta e Catalogo Carte *(in corso)*

- [x] Setup progetto (React + HeroUI + TanStack Router + Supabase)
- [x] Lista carte con scroll infinito
- [x] Filtri: nome, set, rarità, supertipo, tipo, dominio
- [ ] Dettaglio carta (pagina dedicata con tutte le info)
- [ ] Visualizzazione prezzi CardTrader per regione
- [ ] Filtro per keyword e tag
- [ ] Ordinamento (per nome, collector number, prezzo, rarità)
- [ ] Vista lista / vista griglia toggle

### Fase 2 — Autenticazione e Profilo Utente

- [ ] Registrazione e login (Supabase Auth — email/password + Google)
- [ ] Pagina profilo utente
- [ ] Impostazioni account
- [ ] Persistenza sessione su mobile

### Fase 3 — Gestione Collezione

- [ ] Lista "Carte Possedute" (con quantità per carta)
- [ ] Lista "Wishlist"
- [ ] Lista "Carte in Vendita" (con prezzo proposto)
- [ ] Importazione collezione via CSV/scan
- [ ] Valore totale collezione basato su prezzi CardTrader
- [ ] Condivisione collezione tramite link pubblico

### Fase 4 — Deck Builder

- [ ] Creazione mazzi con regole Riftbound (limiti per rarità, supertype, ecc.)
- [ ] Statistiche mazzo (curva di costo, distribuzione tipi, domini)
- [ ] Validazione legalità formato
- [ ] Salvataggio e condivisione mazzi
- [ ] Importa/esporta mazzo in formato testuale

### Fase 5 — Companion di Partita

- [ ] Life point tracker per entrambi i giocatori
- [ ] Contatore turni e fasi
- [ ] Tracker risorse (energy, might)
- [ ] Storico partite (risultati, mazzi usati)
- [ ] Condivisione log partita

### Fase 6 — Native e Ottimizzazioni

- [ ] Build Capacitor per iOS
- [ ] Build Capacitor per Android
- [ ] Camera per scan carte (riconoscimento ottico)
- [ ] Push notification per aggiornamenti prezzi/nuove uscite
- [ ] Modalità offline (cache locale carte)
- [ ] PWA con service worker

---

## Note Architetturali

### Schema Database (`rift_master`)

```
card                — carta base (name, energy, might, power, collector_number, orientation)
  ├── rarity        — rarità (C, U, R, SR, L)
  ├── set           — espansione (name, label, publish_date)
  ├── supertype     — supertipo (es. Champion, Follower, Spell)
  ├── type          — tipo specifico
  ├── media         — immagine carta (image_url, artist)
  ├── metadata      — varianti (alternate_art, signature, overnumbered)
  ├── card_domain   — domini della carta (many-to-many)
  └── card_tag      — tag della carta (many-to-many)

card_price          — prezzi CardTrader (country_code, min_price_cents, avg_price_cents)
```

### Convenzioni

- Le query Supabase usano `queryOptions` di TanStack Query per caching dichiarativo
- I filtri della card list vivono nello stato locale del componente (non nella URL per ora)
- Il domain filter lato client è gestito in memoria per semplicità (join server-side in Fase 1 avanzata)
- `staleTime: Infinity` per i lookup statici (rarities, sets, types, supertypes, domains)
