from django.urls import path

from . import views

urlpatterns = [
    path('articles/', views.ArticlesApi.as_view(), name='articles-list'),
    path('articles/<uuid:pk>/', views.ArticleApi.as_view(), name='article-details'),
]