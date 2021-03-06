from django.urls import path

from . import views

urlpatterns = [
    path('articles/', views.ArticlesApi.as_view(), name='articles-list'),
    path('articles/images', views.UploadArticlesImages.as_view(), name='upload-articles-images'),
    path('articles/<pk>', views.ArticleApi.as_view(), name='article-details'),
    path('comments/', views.CommentsApi.as_view(), name='add-comment'),
    path('comments/<pk>/', views.CommentApi.as_view(), name='comment-details'),
    path('categories/', views.CategoriesApi.as_view(), name='categories-list'),
    path('categories/<pk>', views.CategoryApi.as_view(), name='category'),
    path('search', views.SearchApi, name='search'),
    path('getrelated', views.RelatedArticles, name='related-articles'),

    # Users informations
    path('user/', views.UserAuthApi.as_view(), name='user-auth'),
    path('user-info/<str:pk>', views.UserInfoApi.as_view(), name='user-info'),
    path('user/avatar', views.UserAvatarUpload.as_view(), name='user-avatar'),
    path('staff', views.StaffInfo.as_view(), name='staff-info'),
    path('staff/add', views.AddStaffView, name='add-staff'),

    # Authentication
    path('login', views.UserLoginApi.as_view(), name='user-login'),
    path('register', views.UserRegisterApi.as_view(), name='user-register'),
]