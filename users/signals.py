from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings

from .models import User

import os

@receiver(post_save, sender=User)
def createToken(sender, instance, created, *args, **kwargs) :
    if created :
        Token(user=instance).save()

@receiver(pre_save, sender=User)
def removeUselessFiles(sender, instance, *args, **kwargs) :
    id = instance.id
    try :
        user = User.objects.get(pk=id)
    except User.DoesNotExist :
        return

    if user.avatar != '/media/users/default-user.png' and user.avatar != instance.avatar :
        path = user.avatar.lstrip('/').lstrip('media').lstrip('/')
        full_path = os.path.join(settings.MEDIA_ROOT, path)
        os.remove(full_path)

@receiver(post_delete, sender=User)
def removeUserFiles(sender, instance, *args, **kwargs) :
    path = instance.avatar.lstrip('/').lstrip('media').lstrip('/')
    full_path = os.path.join(settings.MEDIA_ROOT, path)
    os.remove(full_path)