#!/bin/sh

python manage.py makemigrations
python manage.py migrate

# Check if the superuser already exists. If not, create it.
echo "from django.contrib.auth import get_user_model; User = get_user_model(); if not User.objects.filter(username='admin').exists(): User.objects.create_superuser('admin', 'admin@example.com', 'admin')" | python manage.py shell

exec "$@"
