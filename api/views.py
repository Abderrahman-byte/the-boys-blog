from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import *
from blog.models import Article

class ArticlesApi(APIView) :
    def get(self, request) :
        features = request.query_params.get('features', None)

        if features is not None :
            articles_list = Article.objects.all().order_by('-posted_date')[:3]
        else :
            articles = Article.objects.all().order_by('-posted_date')

        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, content_type='application/json')

    def post(self, request) :
        pass