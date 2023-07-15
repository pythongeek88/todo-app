from django.urls import path, include
from rest_framework.routers import DefaultRouter
from todos import views

router = DefaultRouter()
router.register(r'todos', views.TodoViewSet, basename='todo')

urlpatterns = [
    path('', include(router.urls)),
]
