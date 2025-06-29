# backend/core/urls.py

from django.urls import path
from . import views

# simplejwtが提供するビューをインポート
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('teams/create/', views.TeamCreateView.as_view(), name='team-create'),
    path('register/', views.TeamRegistrationView.as_view(), name='team-registration'),
    path('users/me/', views.MeView.as_view(), name='user-me'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]