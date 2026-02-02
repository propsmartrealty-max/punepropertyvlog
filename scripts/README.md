
# Utility Scripts

This directory contains automation and verification scripts to help manage the Propsmart Realty project.

## 1. Builder Seeding (`seed_builders.ts`)
**Purpose**: Automatically populates the database with builders and their projects.
**When to use**: 
- When setting up a fresh database.
- If you need to add a bulk list of new builders (edit the `SEED_DATA` inside the script first).
**Command**:
```bash
npx tsx scripts/seed_builders.ts
```

## 2. RLS Security Test (`test_rls.ts`)
**Purpose**: Checks if "Row Level Security" is active. It attempts to write to the database *without* login credentials.
**When to use**: 
- Before going to production.
- Use it to confirm that your database is SECURE (it should print "Insert Failed"). 
- Currently, it prints "Insert Succeeded" because we are in Dev Mode.
**Command**:
```bash
npx tsx scripts/test_rls.ts
```

## 3. Schema Check (`check_schema.ts`)
**Purpose**: Diagnostics tool to verify if specific tables/columns exist in your Supabase database.
**When to use**: 
- If the app is crashing due to "missing column" errors.
**Command**:
```bash
npx tsx scripts/check_schema.ts
```

## 4. Sitemap Generator (`generate-sitemap.mjs`)
**Purpose**: creates `sitemap.xml` for Google SEO.
**When to use**: 
- Runs automatically during `npm run build`. You rarely need to run this manually.
