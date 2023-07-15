from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView


from .models import Todo
from .serializers import TodoSerializer, UserSerializer


class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Todo.objects.filter(owner=user)
        return Todo.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['patch'], url_path='batch-update')
    def batch_update(self, request, pk=None):
        data = request.data

        for todo_data in data:
            try:
                todo_item = self.get_queryset().get(pk=todo_data['id'])
                todo_item.order = todo_data['order']
                todo_item.save()
            except Todo.DoesNotExist:
                return Response({"detail": f"Todo with id {todo_data['id']} does not exist."},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Batch update successful."})


class UserCreate(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


    def get_serializer(self):
        return UserSerializer()

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
