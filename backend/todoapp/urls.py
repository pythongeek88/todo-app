from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from todos.views import UserCreate



schema_view = get_schema_view(
    openapi.Info(
        title="Todo API",
        default_version='v1',
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', UserCreate.as_view(), name='register'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('', include('todos.urls')),
    path('', include('custom_auth.urls')),
]
