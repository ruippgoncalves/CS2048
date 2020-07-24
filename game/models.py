""""Models Abstraction"""
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    """Users Model"""

class Game(models.Model):
    """Game Model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # 2 4 8 16 32 64 128 256 512 1024 2048 4096 8192 16384 32768 65536
    # 65536 = 2 ^ 16
    max_value = models.PositiveSmallIntegerField()
    time = models.PositiveIntegerField()

    def serialize(self):
        """Easely managable object of Game"""
        print(2 ** (self.max_value + 10))
        return {
            "username": self.user.username,
            "value": 2 ** (self.max_value + 10),
            "time": self.time
        }
