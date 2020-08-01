from django.db import models
from django.contrib.auth.models import AbstractUser

import random, string

def getUserId(): 
    allowed = list(string.ascii_letters + string.digits)
    return ''.join([random.choice(allowed) for _ in range(11)])

# class StaffTitle(models.Model) :
#     title = models.CharField(200)

#     class Meta :
#         constraints = [
#             models.UniqueConstraint(fields=['title'], name='stafftitle_title_unique')
#         ]

class User(AbstractUser) :
    id = models.CharField(primary_key=True, default=getUserId, max_length=11)
    # staff_title = models.ForeignKey(StaffTitle, on_delete=models.SET_NULL, null=True, blank=True)
    staff_title = models.CharField(max_length=200, null=True, blank=True)
    about = models.CharField(max_length=500, null=True, blank=True)

    # User profil image is missing

    def save(self, *args, **kwargs) :
        if self.is_staff :
            if self.staff_title is None or self.staff_title == '':
                raise Exception('Staff members should have staff title registered')

            if self.first_name is None or self.first_name == '' :
                raise Exception('First name is required for staff members')

            if self.last_name is None or self.last_name == '' :
                raise Exception('Last name is required for staff members')

            if self.about is None or self.about == '' :
                raise Exception('About text is required for staff members')
        
        if not self.is_staff or not self.is_superuser :
            self.staff_title = None 

        super().save(*args, **kwargs)

