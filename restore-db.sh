#!/bin/bash

# Load environment variables from the .env file
export $(cat .env | xargs)

# Define variables
BACKUP_FILE="./backups/postgres.dump"  # Path to your backup file
echo "Current working directory: $(pwd)"
echo "Looking for backup file at: $BACKUP_FILE"
# Check if the backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  echo "Please ensure the backup file is present in the ./backups directory."
  exit 1
fi

# Restore the database from the backup file
echo "Restoring database '$POSTGRESDB_DATABASE' from '$BACKUP_FILE'..."
docker exec -i backend_db_1 pg_restore -U $POSTGRESDB_USER -d $POSTGRESDB_DATABASE  < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Database restore completed successfully."
else
  echo "Database restore failed. Please check the logs for more details."
fi
