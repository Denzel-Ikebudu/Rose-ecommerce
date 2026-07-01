#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from django.contrib.auth import get_user_model


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':

    main()

    
def create_render_superuser():
    User = get_user_model()
    username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "SecurePass123!")
    
    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser for Render: {username}")
        User.objects.create_superuser(username=username, email=email, password=password)
    else:
        print("Superuser already exists.")

# Call the function directly so it runs when the server boots
try:
    import django
    django.setup()
    create_render_superuser()
except Exception as e:
    pass