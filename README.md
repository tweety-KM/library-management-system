# Library Management System

A full-stack library management app built with React, NestJS, TypeScript, PostgreSQL and Prisma.

## Setup (api)
1. `cd api && npm install`
2. Copy `.env.example` to `.env` and add your PostgreSQL connection string
3. `npx prisma migrate dev`
4. `npx prisma db seed`
5. `npm run start:dev`

## Schema Decisions

**Why Book references Genre instead of embedding it.**
Book stores a `genreId` foreign key pointing to a row in the Genre table rather than
copying the genre's details inside each book. Genres are shared: many books belong
to one genre. Storing the genre once means a rename (e.g. "Sci-Fi" to "Science Fiction")
is a single update that every book reflects, rather than editing hundreds of copies that
could fall out of sync. The foreign key also lets PostgreSQL enforce integrity, so a
book cannot point to a genre that doesn't exist, and it makes queries like "all books
in genre 2" fast and simple. Prisma's `@relation` keeps this typed in TypeScript.

**Role enum.** `User.role` uses a `Role` enum (PATRON, LIBRARIAN) so only valid roles can
be stored, which prepares for role-based Guards in Week 2.

**Unique fields.** `isbn`, `Genre.name`, `Genre.slug` and `User.email` are unique to
prevent duplicates.