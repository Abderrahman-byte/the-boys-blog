from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseBadRequest, Http404
from django.contrib.auth import authenticate
from django.db import utils
from rest_framework.parsers import FileUploadParser

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .serializers import *
from .permissions import *
from blog.models import Article
from .utils import upload_file, delete_file

from urllib.parse import urlparse

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
        try :
            data = request.data
            data['author'] = request.user
            if data.get('overview') is not None :
                parsed_overview = urlparse(data.get('overview'))
                if parsed_overview.netloc == request.get_host() :
                    data['overview'] = parsed_overview.path

            article = ArticleSerializer().create(data)
            serializer = ArticleSerializer(article)
        except Exception as ex:
            return Response({'details': ex.__str__()}, status=400, content_type='application/json')
            
        return Response(serializer.data, status=201, content_type='application/json')
        
class ArticleApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthorOrReadOnly]

    def get(self, request, pk) :
        try :
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist :
            raise Http404

        self.check_object_permissions(request, article)
        serializer = ArticleSerializer(article)
        return Response(serializer.data, content_type='application/json')

    def put(self, request, pk) :
        try :
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist :
            raise Http404

        self.check_object_permissions(request, article)
        data = request.data
        try :
            article = ArticleSerializer().update(article, data)
            serializer = ArticleSerializer(article)
        except Exception as ex :
            return Response({'details': ex.__str__()}, status=400, content_type='application/json')
            
        return Response(serializer.data, status=201, content_type='application/json')

    def delete(self, request, pk) :
        try :
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist :
            raise Http404

        self.check_object_permissions(request, article)
        article.delete()
        return Response(status=204)

class UploadArticlesImages(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsStaff]

    def post(self, request) :
        image = request.FILES['image']
        file_path = upload_file(image, 'images')
        url = f'{request.scheme}://{request.get_host()}{file_path}'
        context = {'success': 1, 'file': {'url': url}}
        return Response(context, content_type='application/json')

    def delete(self, request) :
        data = request.data
        file = data.get('file')
        if file is not None : file_url = file.get('url')
        else : file_url = none
        
        url_parsed = urlparse(file_url)

        if request.get_host() != url_parsed.netloc :
            return Response({'details': 'hostname does\'not match.'}, status=400, content_type='application/json')

        file_path = url_parsed.path.lstrip('/').lstrip('media').lstrip('/')
        exists = delete_file(file_path)

        if not exists :
            return Response({'details': 'Image doesnot exists.'}, status=400, content_type='application/json')
        
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
            raise Http404

        self.check_object_permissions(request, comment)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=201, content_type='application/json')

    def put(self, request, pk) :
        try :
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist :
            raise Http404

        self.check_object_permissions(request, comment)
        data = request.data

        comment = CommentSerializer().update(data)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=201, content_type='application/json')

    def delete(self, request, pk) :
        try :
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist :
            raise Http404

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

class UserAvatarUpload(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        avatar = request.FILES['avatar']
        avatar_url = upload_file(avatar, 'users')
        data = {'avatar': avatar_url}
        UserSerializer().update(user, data)
        return Response(status=204)

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
        except Exception as ex :
            context = {'details': ex.__str__()}
            status = 400

        return Response(context, status=status, content_type='application/json') 