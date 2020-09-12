from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseBadRequest, Http404, HttpResponseForbidden, HttpResponseNotFound
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
        params = request.query_params
        author_id = params.get('author')
        try :
            limit = int(params.get('limit', 5))
            offset = int(params.get('offset', 0))
        except :
            limit = 5
            offset = 0

        if author_id is not None :
            try :
                author = User.objects.get(pk=author_id)
            except User.DoesNotExist :
                # Returns badrequest instead of 404
                return HttpResponseBadRequest()
            articles = author.article_set.all().order_by('-posted_date')[offset: limit + offset]
        else :
            articles = author.article_set.all().order_by('-posted_date')[offset: limit + offset]

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
        print('Get article api')
        try :
            article = Article.objects.get(pk=pk)
            article.add_view() # Not good way to add new views
        except Article.DoesNotExist :
            # Returns badrequest instead of 404
            # That didnt work
            return HttpResponseForbidden

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
# # # # # # # # # # #

class CommentsApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request) :
        data = request.query_params
        id = data.get('id')
        try : 
            limit = int(data.get('limit', 10))
            offset = int(data.get('offset', 0))
        except :
            limit = 10
            offset = 0
        
        try :
            article = Article.objects.get(pk=id)
            comments = article.comment_set.all().order_by('-posted_date')[offset:offset + limit]
        except :
            return HttpResponseBadRequest()

        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data, status=200, content_type='application/json')
        
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

        comment = CommentSerializer().update(comment, data)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=201, content_type='application/json')

    def delete(self, request, pk) :
        try :
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist :
            raise Http404

        self.check_object_permissions(request, comment)
        comment.delete()
        return Response(status=204)


# Categories Views
# # # # # # # # # #

class CategoriesApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request) :
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, content_type='application/json')

    def post(self, request) :
        try :
            data = request.data
            category = CategorySerializer().create(data)
            serializer = CategorySerializer(category)
        except Exception as ex:
            return Response({'details': ex.__str__()}, status=400, content_type='application/json')

        return Response(serializer.data, status=201, content_type='application/json')

class CategoryApi(APIView) :    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]

    # THAT DID WORK
    # def get(self, request, pk) :
    #     return Response({'details': f'Doesn\'t exists {pk} '}, status=404, content_type='application/json')

    def put(self, request, pk) :
        data = request.data
        try :
            category = Category.objects.get(pk=pk)
            category_updated = CategorySerializer().update(category, data)
            serializer = CategorySerializer(category)
            return Response(serializer.data, status=201, content_type='application/json')
        except Category.DoesNotExist:
            details = 'Category does\' exists, or have been deleted'
            return Response({'details': details}, status=400, content_type='application/json')
        except Exception as ex :
            return Response({'details': ex.__str__()}, status=400, content_type='application/json')

    def delete(self, request, pk) :
        try :
            category = Category.objects.get(pk=pk)
            category.delete()
            return Response('', status=204)
        except Category.DoesNotExist:
            details = 'Category does\' exists, or have been deleted'
            return Response({'details': details}, status=400, content_type='application/json')

# Auth Views 
# # # # # #

class UserAuthApi(APIView) :
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

class UserInfoApi(APIView) :
    def get(self, request, pk) :
        try : 
            author = User.objects.get(pk=pk)
        except User.DoesNotExist :
            # Instead of 404 we used bad request
            return HttpResponseBadRequest()

        serializer = UserSerializer(author)
        return Response(serializer.data, content_type='application/json')