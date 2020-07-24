from django.test import TestCase

from .models import User, Game

# Create your tests here.


class Cs2048TestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user(username="test",
                                        email="test@example.com",
                                        password="test1234")

        Game.objects.create(user=user, max_value=6, time=54000)

    def user(self):
        """Check if the user object can be generated"""
        self.assertEqual(User.objects.count(), 1)

    def game(self):
        """Check if the game object can be generated"""
        self.assertEqual(Game.objects.count(), 1)