from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone

class Command(BaseCommand):
    help = 'Create a superuser with default values for required fields'

    def handle(self, *args, **options):
        User = get_user_model()

        self.stdout.write(self.style.WARNING('Warning: This command will create a superuser with default values for required fields.'))
        confirm = input("Do you want to continue? (y/n): ")
        if confirm.lower() != 'y':
            self.stdout.write(self.style.SUCCESS('Operation cancelled.'))
            return

        username = input("Enter username: ")
        email = input("Enter email: ")
        password = input("Enter password: ")

        admin_age = 23 # Older than 18 years allowed
        default_date = timezone.now().date().replace(year=timezone.now().year - admin_age)
        default_brokerage = "DefaultBrokerage"
        default_subscription = "DefaultTier"

        with transaction.atomic():
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                date_of_birth=default_date,
                brokerage=default_brokerage,
                subscription_tier=default_subscription
            )

        self.stdout.write(self.style.SUCCESS(f'Superuser {username} created successfully with default values!'))
        self.stdout.write(self.style.WARNING(f'Default date of birth: {default_date}'))
        self.stdout.write(self.style.WARNING(f'Default brokerage: {default_brokerage}'))
        self.stdout.write(self.style.WARNING(f'Default subscription tier: {default_subscription}'))
        self.stdout.write(self.style.WARNING('Please update these values in the admin interface if needed.'))