from users.models import CustomUser
from django.db import models


class Todo(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
