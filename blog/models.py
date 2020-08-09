from django.db import models

from users.models import User

from uuid import uuid4

class Category(models.Model) :
    id = models.UUIDField(primary_key=True, default=uuid4)
    title = models.CharField(max_length=200)
    short_title = models.CharField(max_length=200)

    class Meta :
        constraints = [
            models.UniqueConstraint(fields=['title'], name='category_unique_title'),
            models.UniqueConstraint(fields=['short_title'], name='category_unique_short_title'),
        ]

class Article(models.Model) :
    id = models.UUIDField(primary_key=True, default=uuid4)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category)
    title = models.CharField(max_length=500)
    content = models.TextField()
    views = models.IntegerField(default=0)
    posted_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta :
        constraints = [
            models.UniqueConstraint(fields=['title'], name='article_unique_title')
        ]

    def add_view(self) :
        self.views = self.views + 1
        self.save()

    def save(self, *args, **kwargs) :
        if not self.author.is_staff :
            raise Exception('Only staff members can publish articles')
        
        super().save(*args, **kwargs)

class Comment(models.Model) :
    id = models.UUIDField(primary_key=True, default=uuid4)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    posted_date = models.DateTimeField(auto_now_add=True)