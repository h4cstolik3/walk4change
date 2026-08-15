# AGENTS.md — walk4change

## Purpose

Rust/Axum backend for the walk4change application. LIVE on lw-main
as a Docker container (`walk4change-prod` on :8080), fronted by
Cloudflared, backed by Supabase (pooler) for persistence and Gmail
SMTP for magic-link auth.

## Active architecture

- Rust/Axum HTTP service, single binary in Docker.
- Persistence: Supabase Postgres (via connection pooler).
- Auth: magic-link over Gmail SMTP; delivered mail often lands in
  SPAM — user aware.
- Ingress: Cloudflared ingress rule (rule #0) → :8080.
- Deploy target: lw-main via Docker (`docker run --restart=always
  --name walk4change-prod ...`).

## Commands

| What | Command |
|---|---|
| build | `cargo build --release` |
| test | `cargo test` |
| local run | `cargo run` |
| logs (prod) | `rtk proxy docker logs walk4change-prod` |
| restart (prod) | `docker restart walk4change-prod` |
| lint | `cargo clippy --all-targets --all-features` |

## Constraints

- **`rtk proxy` for docker logs** — otherwise rtk filters volume
  is too aggressive on tailed logs.
- **Supabase pooler** is the only supported endpoint; direct
  connection may fail on lw-c2 due to DNS. Use pooler URL.
- **Gmail SMTP lands in SPAM.** Advise users during onboarding.
- **Do not rewrite** `Cargo.toml` deps without checking against a
  build; some pins are load-bearing.

## Boundaries

- **This repo owns:** the Rust service source.
- **This repo does NOT own:** the Docker deploy setup on lw-main
  (that's Ansible-driven), the Supabase project (external), the
  Cloudflared config (external).

## Detailed documentation

- Root `README.md` where present.

## Memory rules

- **Reads:** Obsidian `projects/walk4change/`, this file.
- **Writes:** draft first; never rewrite this file or Cargo.toml
  without an explicit "yes".
- **Semantic memory scope:** `project_id = walk4change`.

## Escalation

None (personal project; single-user internal beta).

<!-- graft:start -->
## Graft — repo context graph

This repo is indexed in `graft/`: small linked markdown nodes that explain each
system and carry exact file:line spans, kept in sync with the code through git.

For ANY task here — understanding how something works, finding where code lives,
or scoping a change — get context from the graph before grepping or opening
source files. Re-ask freely (it's cheap) and reuse literal identifiers you
already have (symbol, error string, file name) as the query. New to this repo?
Run `graft map` first — a token-budgeted orientation (dir clusters, hubs,
hotspots), no LLM, no key.

- Run `graft ask "<your question>" --source` → ranked nodes with the relevant
  code spans inlined (each hit's ≤8-line crux by default; `--full` for whole
  definitions when the crux isn't enough). Match the tool to the task shape:
  for understanding or editing, the top node IS the answer — cite its
  `covers:` file:line spans and edit straight from `--source`. For
  exhaustive tasks ("every occurrence / every caller of this pattern"), ranked
  results are top-N, not complete — run `graft grep "<literal>"` instead
  (exhaustive over indexed files, grouped by enclosing symbol), falling back
  to raw `grep -rn` only for unindexed files.
- `graft skeleton <file>` → every definition's signature + span, ~10× cheaper
  than reading the file; use it to skim an API surface.
- `graft callers <symbol>` gives precomputed, exact edges — who calls this.
  Add `--direction out` for what it calls, or `--depth N` to walk
  transitively for the full blast radius. For structural questions, skip
  ranking and use this directly.
- Or browse: `graft/INDEX.md` lists every node; follow the links.
- Monorepos and folders of multiple repos rank fairly across sub-projects —
  hits carry `[scope/]` labels naming which one they're from. Narrow with
  `graft ask "<task>" --in <scope>/` once you know where you're working.

If a returned span is truncated ("+N more lines"), open the file at that exact
range before finalizing. Only open source files when a node genuinely lacks a
needed detail, and then at the exact file:line the node points to — never
re-read whole files.

After big code changes, refresh the graph with `graft build` (deterministic,
no API key, $0).
<!-- graft:end -->
