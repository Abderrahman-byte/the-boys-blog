from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

import random, string

def getUserId(): 
    allowed = list(string.ascii_letters + string.digits)
    return ''.join([random.choice(allowed) for _ in range(11)])


class User(AbstractUser) :
    id = models.CharField(primary_key=True, default=getUserId, max_length=11)
    email = models.EmailField(blank=True, null=True, unique=True, error_messages={ 
        'unique': _("This email has already been registered.")})
    staff_title = models.CharField(max_length=200, null=True, blank=True)
    about = models.CharField(max_length=500, null=True, blank=True)
    avatar = models.TextField(default='/media/users/default-user.png')

    def save(self, *args, **kwargs) :
        # MUST ADD A EMAIL VERIFICATION

        if self.is_staff :
            if self.staff_title is None or self.staff_title == '':
                raise Exception('Staff members should have staff title registered')

            if self.first_name is None or self.first_name == '' :
                raise Exception('First name is required for staff members')

            if self.last_name is None or self.last_name == '' :
                raise Exception('Last name is required for staff members')

            if self.about is None or self.about == '' :
                raise Exception('About text is required for staff members')
        
        if not self.is_staff and not self.is_superuser :
            self.staff_title = None 

        super().save(*args, **kwargs)