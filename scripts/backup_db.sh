#!/bin/bash
# Description: Automatically pull a pg_dump of the Supabase database.
# Note: Requires standard PostgreSQL tools installed (pg_dump).
# Make sure to set your SUPABASE_DB_URL containing the password in your environment or below.

# Example: SUPABASE_DB_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

if [ -z "$SUPABASE_DB_URL" ]; then
    echo "Error: SUPABASE_DB_URL is not set."
    echo "Please export SUPABASE_DB_URL=\"your-postgres-connection-string\" before running."
    echo "You can find this in your Supabase Dashboard under Settings > Database > Connection String."
    exit 1
fi

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="supabase_backup_${TIMESTAMP}.sql"
BACKUP_DIR="../backups"

# Resolve to an absolute path for safety
BACKUP_DIR_ABS=$(cd "$(dirname "$0")" && mkdir -p "$BACKUP_DIR" && cd "$BACKUP_DIR" && pwd)

echo "Starting database backup to ${BACKUP_DIR_ABS}/${BACKUP_FILE}..."

pg_dump "$SUPABASE_DB_URL" --clean > "${BACKUP_DIR_ABS}/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully: ${BACKUP_DIR_ABS}/${BACKUP_FILE}"
    echo "You can restore this backup using: psql \"\$SUPABASE_DB_URL\" < ${BACKUP_DIR_ABS}/${BACKUP_FILE}"
else
    echo "❌ Backup failed!"
    exit 1
fi
