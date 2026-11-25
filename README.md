# Дипломая работа (бэкенд часть)

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm db:push
pnpm db:seed
pnpm start
```

## Схема базы данных

- [Схема .dmbl](./docs/db.dbml)
- [Описание в .md](./docs/db.md)
