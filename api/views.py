from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.http import HttpResponseNotFound

from .serializers import *
from .permissions import *
from blog.models import Article

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
        article = ArticleSerializer().create(data)
        serializer = ArticleSerializer(article)

        return Response(serializer.data, status=201, content_type='application/json')
        
class ArticleApi(APIView) :
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerOrReadOnly]

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