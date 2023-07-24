#!/bin/sh

set -e

# Wait for the PostgreSQL database to become available
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\l'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

# Apply database migrations
echo "Apply database migrations..."
python manage.py migrate

# Create superuser
echo "Creating superuser..."
python manage.py createsu

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
