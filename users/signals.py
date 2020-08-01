from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from .models import User

@receiver(post_save, sender=User)
def createToken(sender, instance, created, *args, **kwargs) :
    if created :
        Token(user=instance).save()