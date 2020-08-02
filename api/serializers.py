from rest_framework import serializers
from django.utils import timezone

from users.models import User
from blog.models import *

from datetime import datetime

class Timestamp(serializers.Field) :
    def to_representation(self, value) :
        if value is None :
            return None

        if type(value) != datetime :
            raise Exception('Timestamp field must be a datetime instance')

        timestamp = value.replace(tzinfo=timezone.utc).timestamp()
        return timestamp

class UserSerializer(serializers.ModelSerializer) :
    date_joined = Timestamp()

    class Meta :
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'is_staff', 'is_superuser', 'date_joined']

    def create(self) :
        raise Exception('You Forgot to make Create method for User Serializer')

    def update(self) :
        raise Exception('You Forgot to make Update method for User Serializer')

class CategorySerializer(serializers.Serializer) :
    id = serializers.UUIDField()
    title = serializers.CharField()
    short_title = serializers.CharField()

    def create(self) :
        raise Exception('You Forgot to make Create method for Category Serializer')

    def update(self) :
        raise Exception('You Forgot to make Update method for Category Serializer')

class CommentSerializer(serializers.ModelSerializer) :
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    article = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta :
        model = Comment
        fields = ['id', 'user', 'article', 'content']

    def create(self) :
        raise Exception('You Forgot to make Create method for Comments Serializer')

    def update(self) :
        raise Exception('You Forgot to make Update method for Comments Serializer')

class ArticleSerializer(serializers.Serializer) :
    id = serializers.UUIDField()
    author = UserSerializer()
    categories = CategorySerializer(many=True)
    title = serializers.CharField()
    content = serializers.CharField()
    comment_set = CommentSerializer(many=True)

    def create(self, validated_data) :
        categories_id = validated_data.pop('categories', [])
        article = Article(**validated_data)
        article.categories = Category.objects.filter(id__in=categories_id)
        article.save()
        return article

    def update(self, instance, validated_data) :
        categories_id = validated_data.pop('categories', [])
        instance.title = validated_data.get(title, instance.title)
        instance.content = validated_data.get(title, instance.content)
        instance.categories = Category.objects.filter(id__in=categories_id)
        instance.save()
        return instance