from django.urls import path

from . import views

urlpatterns = [
    path('articles/', views.ArticlesApi.as_view(), name='articles-list'),
    path('articles/<uuid:pk>', views.ArticleApi.as_view(), name='article-details'),
    path('comments/', views.CommentsApi, name='add-comment'),
    path('comments/<uuid:pk>/', views.CommentApi, name='comment-details'),

    path('user/', views.UserInfoApi.as_view(), name='user-info'),
    path('user/avatar', views.UserAvatarUpload.as_view(), name='user-avatar'),
    path('login', views.UserLoginApi.as_view(), name='user-login'),
    path('register', views.UserRegisterApi.as_view(), name='user-register'),
]