from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseNotFound, HttpResponseBadRequest
from django.contrib.auth import authenticate
from django.db import utils

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .serializers import *
from .permissions import *
from blog.models import Article

# Articles Api
# # # # # #

class ArticlesApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsStaffOrReadOnly]

    def get(self, request) :
        features = request.query_params.get('features', None)

        if features is not None :
            articles_list = Article.objects.all().order_by('-posted_date')[:3]
        else :
            articles = Article.objects.all().order_by('-posted_date')

        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, content_type='application/json')

    def post(self, request) :
        data = request.data
        data['author'] = request.user
        article = ArticleSerializer().create(data)
        serializer = ArticleSerializer(article)

        return Response(serializer.data, status=201, content_type='application/json')
        
class ArticleApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthorOrReadOnly]

    def get(self, request, pk) :
        try :
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist :
            return HttpResponseNotFound()

        self.check_object_permissions(request, article)
        serializer = ArticleSerializer(article)
        return Response(serializer.data, content_type='application/json')

    def put(self, request, pk) :
        try :
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist :
            return HttpResponseNotFound()

        self.check_object_permissions(request, article)
        data = request.data
        article = ArticleSerializer().update(article, data)
        serializer = ArticleSerializer(article)
        return Response(serializer.data, status=201, content_type='application/json')

    def delete(self, request, pk) :
        try :
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist :
            return HttpResponseNotFound()

        self.check_object_permissions(request, article)
        article.delete()
        return Response(status=204)

# Comments APi Views 
# # # # # #

class CommentsApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request) :
        data = request.data
        data['author'] = request.user

        try :
            data['article'] = Article.objects.get(pk=data.get('article'))
        except Article.DoesNotExist:
            return HttpResponseBadRequest()

        comment = CommentSerializer().create(data)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=201, content_type='application/json')

class CommentApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthorOrReadOnly]

    def get(self, request, pk) :
        try :
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist :
            return HttpResponseNotFound()

        self.check_object_permissions(request, comment)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=201, content_type='application/json')

    def put(self, request, pk) :
        try :
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist :
            return HttpResponseNotFound()

        self.check_object_permissions(request, comment)
        data = request.data

        comment = CommentSerializer().update(data)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=201, content_type='application/json')

    def delete(self, request, pk) :
        try :
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist :
            return HttpResponseNotFound()

        self.check_object_permissions(request, comment)
        return Response(status=204)

# Auth Views 
# # # # # #

class UserInfoApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request) :
        user = request.user
        serializer = UserSerializer(user)
        context = {'user': serializer.data}
        return Response(context, content_type='application/json')

    def put(self, request) :
        user = request.user
        data = request.data
        updated_user = UserSerializer().update(user, data)
        serializer = UserSerializer(updated_user)
        return Response(serializer.data, content_type='application/json')

class UserLoginApi(APIView) :

    def post(self, request) :
        data = request.data
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is None :
            context = {'details': 'The username or password you entred is incorrect.'}
            status = 401
        else :
            token = user.auth_token.key
            serializer = UserSerializer(user)
            context = { 'user': serializer.data, 'token': token }
            status = 200

        return Response(context, status=status, content_type='application/json')

class UserRegisterApi(APIView) :
    def post(self, request) :
        data = request.data
        try :
            user = UserSerializer().create(data)
            serializer = UserSerializer(user)
            token = user.auth_token.key
            status = 201
            context = {'token': token, 'user': serializer.data }
        except utils.IntegrityError :
            context = {'details': 'Username already exist.'}
            status = 400
        except Exception as ex :
            context = {'details': ex}
            status = 400

        return Response(context, status=status, content_type='application/json') 