from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from django.conf import settings

from .models import * 
from api.utils import *

import os

@receiver(pre_save, sender=Article)
def delete_media_on_modfie(sender, instance, *args, **kwargs) :
    id  = instance.id
    
    try :
        article = Article.objects.get(pk=id)
    except Article.DoesNotExist :
        return 0

    prev_media = get_media_list(article)
    new_media = get_media_list(instance)

    for media in prev_media :
        if media not in new_media :
            media_path = os.path.join(settings.MEDIA_ROOT, media)
            try :
                os.remove(media_path)
            except Exception as ex :
                pass

@receiver(post_delete, sender=Article)
def delete_all_media(sender, instance, *args, **kwargs) :
    media_list = get_media_list(instance)

    for media in media_list :
        media_path = os.path.join(settings.MEDIA_ROOT, media)
        try :
            os.remove(media_path)
        except Exception as ex :
            pass