from django.urls import path
from rest_framework_simplejwt import views

from authentication.views import CustomUserView

urlpatterns = [
    path('token/obtain/', views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    path('user/create/', CustomUserView.as_view(), name='create_user')
]