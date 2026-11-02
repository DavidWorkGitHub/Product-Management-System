# Test Plan

## Purpose
Check every page and API route of the Product Management System works, handles bad input safely, and keeps the database consistent.

## Approach
- Tests were drafted with an AI model (Claude) from the assignment brief, then reviewed and run by me.
- Tool: **Vitest**. Tests run against the live app (`npm run dev`) and PocketBase, so they exercise the real stack.
- Every test that creates data cleans it up afterwards.

## Scope
| Area | File | What is checked |
|---|---|---|
| Pages | `pages.test.js` | Home, Products, Add, View, Edit, Admin all load (HTTP 200); unknown product gives 404; home shows Redis text source |
| API CRUD | `api.test.js` | Create, read, update, delete; data really exists in PocketBase after create and is gone after delete |
| Input variation | `inputs.test.js` | Long, short, numeric, wildcard, SQL-style, HTML/script, unicode/emoji strings; bad prices (negative, text, empty, huge) |
| Validation | `inputs.test.js` | Missing fields rejected with 400; invalid JSON rejected |
| Seed data | `api.test.js` | 10 products exist: 4 Dell, 4 Lenovo, 2 Acer |

## Pre-conditions
PocketBase running and seeded (`npm run seed`), app running on `NEXT_PUBLIC_BASE_URL` (default http://localhost:3000).

## Run
```
npm run dev      # terminal 1
npm test         # terminal 2
```
