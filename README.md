# PortfolioRank

App full-stack para priorización de portafolio con metodología multicriterio ponderada.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Route Handlers (API) + Prisma + PostgreSQL
- NextAuth con Email Provider (magic link) y Prisma Adapter
- Zod para validación
- Vitest para pruebas unitarias e integración ligera
- ESLint + Prettier
- Docker Compose para Postgres + MailDev

## Configuración local

1. Copia variables de entorno:

```bash
cp .env.example .env
```

2. Levanta dependencias:

```bash
docker compose up -d
```

3. Instala paquetes:

```bash
npm install
```

4. Ejecuta migraciones y seed:

```bash
npm run prisma:migrate
npm run seed
```

5. Inicia en desarrollo:

```bash
npm run dev
```

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run test`
- `npm run lint`
- `npm run prisma:migrate`
- `npm run prisma:studio`
- `npm run seed`

## MVP implementado
- Auth magic link sin contraseña.
- Seed de admin vía `ADMIN_EMAIL`.
- RBAC `USER/ADMIN` para endpoints administrativos.
- CRUD proyectos por usuario con No-Go + motivo obligatorio.
- Ciclos mensual/trimestral, activación y lock.
- Scoring ponderado con `governance_adjust`, categorías, recomendación y bandera TRAP.
- Ranking con filtros (bucket/status/No-Go).
- Time plan por ciclo editable y persistente.
- Admin panel (endpoints): usuarios, overview, notas `ADMIN_ONLY`, export HTML imprimible.
- Auditoría mínima para cambios de score y No-Go.

## Seguridad y privacidad
- Aislamiento por usuario en endpoints de usuario.
- Endpoints `/api/admin/*` protegidos por rol `ADMIN`.
- Validaciones Zod en payloads.
- Sesiones/cookies de NextAuth (httpOnly por defecto).
- Rate limiting básico in-memory documentado en `lib/rate-limit.ts` (TODO productivo distribuido).

## Magic link local
- **Opción SMTP local (incluida):** MailDev en `http://localhost:1080` y SMTP `localhost:1025`.
- **Fallback dev sin SMTP:** si `EMAIL_SERVER_HOST` está vacío, el link se imprime en consola (`[MAGIC_LINK_DEV]`).
