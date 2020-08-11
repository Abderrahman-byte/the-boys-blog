from rest_framework import serializers
from django.utils import timezone
from django.db import utils

from users.models import User
from blog.models import *

from datetime import datetime

class TimestampField(serializers.Field) :
    def to_representation(self, value) :
        if value is None :
            return None

        if type(value) != datetime :
            raise Exception('Timestamp field must be a datetime instance')

        timestamp = value.replace(tzinfo=timezone.utc).timestamp()
        return round(timestamp * 1000)

class UserSerializer(serializers.ModelSerializer) :
    date_joined = TimestampField()
    articles_count = serializers.IntegerField(source='article_set.count', read_only=True)

    class Meta :
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'avatar', 'is_staff', 'is_superuser', 'date_joined', 'articles_count', 'staff_title']

    def create(self, validated_data) :
        try :
            password = validated_data.pop('password')
            user = User(**validated_data)
            user.set_password(password)
            user.save()
            return user
        except utils.IntegrityError as ex :
            msg = ex.__str__()
            field_name = msg.split()[3].split('.')[1]
            error_msg = user.unique_error_message(User, (field_name,)).message
            raise Exception(error_msg)

    def update(self, instance, validated_data) :
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.email = validated_data.get('about', instance.email)
        instance.save()
        return instance

class CategorySerializer(serializers.Serializer) :
    id = serializers.UUIDField()
    title = serializers.CharField()
    short_title = serializers.CharField()

    def create(self) :
        raise Exception('You Forgot to make Create method for Category Serializer')

    def update(self) :
        raise Exception('You Forgot to make Update method for Category Serializer')

class CommentSerializer(serializers.ModelSerializer) :
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    article = serializers.PrimaryKeyRelatedField(read_only=True)
    posted_date = TimestampField()

    class Meta :
        model = Comment
        fields = ['id', 'author', 'article', 'content', 'posted_date']

    def create(self, validated_data) :
        comment = Comment(**validated_data)
        comment.save()
        return comment

    def update(self, instance, validated_data) :
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance

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
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.categories = Category.objects.filter(id__in=categories_id)
        instance.save()
        return instance