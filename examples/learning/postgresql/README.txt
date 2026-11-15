Sukoaa PostgreSQL starter — Docker with a PostgreSQL 17 container.
Run: docker compose up -d
Connect: docker compose exec postgres psql -U learner -d sukoaa_learning
Inside psql: \i /docker-entrypoint-initdb.d/01-schema.sql is NOT needed on a
fresh volume: Docker runs it on first initialisation. Explore with \dt.
Run the queries in exercises.sql. Stop with docker compose down.
The named volume retains your local data. Do not use these demo credentials
for production. Port 5433 is bound to loopback only.
The Sukoaa browser lab uses PGlite, a single-connection WebAssembly build
of PostgreSQL. It is separate from this full Docker database and from
Sukoaa's existing SQLite compiler. Not every server extension is bundled.
