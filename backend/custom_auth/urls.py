from django.urls import path

from .views import obtain_auth_token


urlpatterns = [
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]
