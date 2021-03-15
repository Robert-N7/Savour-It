from django.conf.urls import url
from django.urls import path

from RecipeApp import views

urlpatterns = [
    path('create/', views.PostRecipe.as_view()),
    path('upload/', views.UploadImage.as_view()),
    path('recipe/<str:name>/', views.RecipeView.as_view()),
    path('', views.RecipeView.as_view()),
    # path('images/<str:name>/', views.ImageView.as_view())
]
