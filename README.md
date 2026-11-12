## Week 2: Book API, Auth & Authorization

### Running it

1. `cd api && npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `JWT_SECRET`
3. `npx prisma migrate deploy` then `npx prisma db seed`
4. `npm run start:dev` (API on http://localhost:3000)

**Seeded librarian account:** `librarian@library.test` / `Librarian123!`
Anyone who registers via `POST /auth/register` gets the `PATRON` role.

### Endpoints

| Method | Route | Access |
|--------|-------|--------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public, returns `access_token` |
| GET | `/genres`, `/genres/:id` | Public |
| POST / PATCH / DELETE | `/genres`, `/genres/:id` | Librarian only |
| GET | `/books` | Public; supports `genreId`, `search` (title/author), `page`, `limit` |
| GET | `/books/:id` | Public |
| POST / PATCH / DELETE | `/books`, `/books/:id` | Librarian only |

### How it fits together

- **Validation:** DTOs use class-validator and a global `ValidationPipe({ whitelist: true })`, so invalid bodies return 400 and unknown fields are stripped.
- **Auth:** passwords are hashed with bcrypt; login issues a JWT (`sub` = user id, `role`); `JwtStrategy` verifies it on protected routes.
- **Authorization:** `JwtAuthGuard` runs first, then `RolesGuard` checks `req.user.role` against `@Roles('LIBRARIAN')`. No token gives 401; a patron token gives 403.
- **Errors:** Nest's built-in exceptions (404 missing record, 409 duplicate ISBN/genre or genre still has books).
- **Stock:** a new book starts with `availableCopies` equal to `totalCopies`.

### Postman

Import `docs/postman_collection.json`, run **Login (librarian)** first (it saves the token), then the guarded requests.