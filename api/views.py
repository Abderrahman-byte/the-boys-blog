from django.http import HttpResponseBadRequest, Http404, HttpResponseForbidden, HttpResponseNotFound
from django.contrib.auth import authenticate
from django.db import utils
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FileUploadParser
from rest_framework.decorators import api_view

from .serializers import *
from .permissions import *
from blog.models import Article
from .utils import *

from urllib.parse import urlparse
import json

# Articles Api
# # # # # #

class ArticlesApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsStaffOrReadOnly]

    def get(self, request) :
        params = request.query_params
        author_id = params.get('author')
        sort = params.get('sort', 'posted_date')
        order_by = f'-{sort}'
        try :
            limit = int(params.get('limit', 5))
            offset = int(params.get('offset', 0))
        except :
            limit = 5
            offset = 0

        if author_id is not None :
            try :
                author = User.objects.get(pk=author_id)
                articles = author.article_set.all().order_by(order_by)[offset: limit + offset]
            except User.DoesNotExist :
                context = {'details': 'Author id doesn\'t exists'}
                return Response(context, status=404, content_type='application/json')
            except Exception as ex :
                context = {'details': ex.__str__()}
                return Response(context, status=400, content_type='application/json')
        else :
            try :
                articles = Article.objects.all().order_by(order_by)[offset: limit + offset]
            except Exception as ex :
                context = {'details': ex.__str__()}
                return Response(context, status=400, content_type='application/json')

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
        except :
            try :
                title = pk.replace('-', ' ')
                article = Article.objects.get(title=title)
            except Article.DoesNotExist :
                context = {'details': 'Article doesn\'t exists'}
                status = 404
                return Response(context, status=status, content_type='application/json')

            except Exception as ex :
                context = {'details': ex.__str__()}
                status = 400
                return Response(context, status=status, content_type='application/json')
  
        try :
            article.add_view()
            self.check_object_permissions(request, article)
            serializer = ArticleSerializer(article)
            context = serializer.data
            status = 200
    
        except Exception as ex :
            context = {'details': ex.__str__()}
            status = 400

        return Response(context, status=status, content_type='application/json')

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
            return Response({'details': 'Article doesn\'t exist.'}, status=201, content_type='application/json')
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')

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
        # You should check if the file is needed
        exists = delete_file(file_path)

        if not exists :
            return Response({'details': 'Image doesn\'t exists.'}, status=400, content_type='application/json')
        
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
        except Article.DoesNotExist:
            return Response({'details': 'Article Doesn\'t exist'})
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200, content_type='application/json')
        
    def post(self, request) :
        data = request.data
        data['author'] = request.user

        try :
            data['article'] = Article.objects.get(pk=data.get('article'))
        except Article.DoesNotExist:
            return Response({'details': 'Article Doesn\'t exist'}, status=404, content_type='application/json')
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')

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
            return Response({'details': 'Comment Doesn\'t exist'}, status=404, content_type='application/json')
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')

        self.check_object_permissions(request, comment)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=200, content_type='application/json')

    def put(self, request, pk) :
        try :
            comment = Comment.objects.get(pk=pk)
            self.check_object_permissions(request, comment)
            data = request.data
            comment = CommentSerializer().update(comment, data)
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=201, content_type='application/json')
        except Comment.DoesNotExist :
            return Response({'details': 'Comment Doesn\'t exist'}, status=404, content_type='application/json')
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')

    def delete(self, request, pk) :
        try :
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist :
            return Response({'details': 'Comment Doesn\'t exist'}, status=404, content_type='application/json')
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')

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

    def get(self, request, pk) :
        params = request.query_params

        try :
            limit = int(params.get('limit', 5))
            offset = int(params.get('offset', 0))
        except :
            limit = 5
            offset = 0

        try :
            category = Category.objects.get(pk=pk)
        except :
            try :
                category = Category.objects.get(short_title=pk)
            except Category.DoesNotExist :
                return Response({'details': f'Doesn\'t exists {pk} '}, status=404, content_type='application/json')
            except Exception as ex:
                return Response({'details': ex.__str__()}, status=400, content_type='application/json')

        articles = category.article_set.all().order_by('-posted_date')[offset: offset + limit]
        category_data = CategorySerializer(category).data
        articles_data = ArticleSerializer(articles, many=True).data
        category_data['articles'] = articles_data

        return Response(category_data, status=200, content_type='application/json')

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
            return Response(status=204)
        except Category.DoesNotExist:
            details = 'Category does\' exists, or have been deleted'
            return Response({'details': details}, status=400, content_type='application/json')
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')

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
        updated_user = UserSerializer().update(user, user, data)
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
        context = UserSerializer(UserSerializer().update(user, user, data)).data
        return Response(context, status=201, content_type='application/json')

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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsSelfOrReadOnly]

    def get(self, request, pk) :
        try : 
            author = User.objects.get(pk=pk)
        except User.DoesNotExist :
            return Response({'details': 'User Doesn\'t exist'}, status=404, content_type='application/json')
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')

        serializer = UserSerializer(author)
        return Response(serializer.data, content_type='application/json')
    
    def put(self, request, pk) :
        user = request.user
        try : 
            author = User.objects.get(pk=pk)
        except User.DoesNotExist :
            return Response({'details': 'User Doesn\'t exist'}, status=404, content_type='application/json')
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')

        self.check_object_permissions(request, author)
        try :
            data = request.data
            context = UserSerializer(UserSerializer().update(user, author, data)).data
            return Response(context, content_type='application/json')
        except Exception as ex :
            return Response({'details': ex.__str__()}, status=404, content_type='application/json')
            
class StaffInfo(APIView) :
    def get(self, request) :
        params = request.query_params

        try :
            limit = int(params.get('limit', 5))
            offset = int(params.get('offset', 0))
        except :
            limit = 5
            offset = 0

        admins = User.objects.filter(is_superuser=True).order_by('date_joined')
        staff_members = User.objects.filter(is_superuser=False, is_staff=True).order_by('date_joined')
        staff = staff_members | admins
        staff = staff[offset: limit + offset]
        data = UserSerializer(staff, many=True).data
        count = admins.count() + staff_members.count()
        
        return Response({'data': data, 'count': count}, content_type='application/json')

# Search API 
# # # # # # # #
@api_view(['GET'])
def SearchApi(request) :
    data = request.query_params
    query = data.get('query')
    types = data.getlist('type')
    
    try :
        limit = int(data.get('limit', 5))
        offset = int(data.get('offset', 0))
    except :
        limit = 5
        offset = 0

    try :
        staff_limit = int(data.get('staff_limit', limit))
        staff_offset = int(data.get('staff_offest', offset))
    except :
        staff_limit = limit
        staff_offset = offset

    # SEND ERROR MESSAGE IF QUERY PARAMETER
    if query is None :
        return Response({'details': 'query not provided'}, status=400, content_type='application/json')
    
    # GET STAFF MEMBERS BASE ON QUERY
    if 'staff' in types :
        staff_members = User.objects.filter(
            Q(is_staff=True) & Q(
            Q(username__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(staff_title__icontains=query))
        )
        staff_count = staff_members.count()
        staff_members = staff_members[staff_offset: staff_limit + staff_offset]
    else : 
        staff_members = None
        staff_count = 0

    # GET ARTICLES THAT CONTAINS THE QUERY
    if 'article' in types :
        articles_first_class = Article.objects.filter(title__icontains=query, content__icontains=query)
        fclass_ids_q = [Q(id=str(art.id)) for art in articles_first_class]
        articles_sec_class = Article.objects.filter(Q(title__icontains=query) | Q(content__icontains=query) ).exclude(*fclass_ids_q)
        articles = articles_first_class | articles_sec_class
        articles_count = articles.count()
        articles = articles[offset: limit + offset]
    else :
        articles_count = 0
        articles = None

    # GET CATEGORIES THAT TITLE CONTAINS QUERY
    if 'category' in types :
        categories = Category.objects.filter(title__icontains=query)
    else :
        categories = None

    #  SERIALLIZE MODELS DATA WITH COUNT
    if staff_members is not None :
        staff_data = {
            'count': staff_count, 
            'data': UserSerializer(staff_members, many=True).data
        }
    else : staff_data = {}

    if articles is not None :
        articles_data = {
            'count': articles_count, 
            'data': ArticleSerializer(articles, many=True).data
        }
    else : articles_data = {}

    if categories is not None :
        categories_data = {
            'count': categories.count(), 
            'data': CategorySerializer(categories, many=True).data
        }
    else : categories_data = {}

    # SEND DATA RESULTS
    context = {'staff': staff_data, 'categories': categories_data, 'articles': articles_data}
    return Response(context, content_type='application/json')

@api_view(['GET'])
def RelatedArticles(request) :
    id = request.query_params.get('id')

    try :
        article = Article.objects.get(pk=id)
    except Article.DoesNotExist :
        return Response({'details': 'Article doesnt exists with that id'}, status=404, content_type='application/json')
    except Exception as ex :
        context = {'details': ex.__str__()}
        return Response(context, status=400, content_type='application/json')
    
    related = get_related_article(article, Article, 4)
    data = ArticleSerializer(related, many=True).data
    return Response(data, content_type='application/json')

@api_view(['POST'])
def AddStaffView(request) :
    data = request.data
    username = data.get('username')
    staff_title = data.get('staff_title')
    
    try :
        user_ = User.objects.get(username=username)
    except User.DoesNotExist :
        context = {'details': f'User with username {username} Doent exist'}
        return Response(context, status=404, content_type='application/json')
 
    if user_.is_staff :
        context = {'details': f'User {username} is already a staff member'}
        return Response(context, status=404, content_type='application/json')
    else :
        print(data)
        try :
            user_.staff_title = staff_title
            user_.about = user_.email
            user_.first_name = user_.username
            user_.last_name = user_.username
            user_.is_staff = True
            user_.save()

            context = UserSerializer(user_).data
            return Response(context, status=200, content_type='application/json')
        except Exception as ex :
            context = {'details': ex.__str__()}
            return Response(context, status=400, content_type='application/json')