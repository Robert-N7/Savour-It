from django.conf.urls import url
from django.urls import path

from RecipeApp import views

urlpatterns = [
    path('create/', views.PostRecipe.as_view()),
    url(r'recipe/(?P<name>[^/]*)/$', views.RecipeView.as_view()),
    path(r'', views.RecipeView.as_view())
]
