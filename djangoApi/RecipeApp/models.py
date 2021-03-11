from django.contrib.auth.models import AbstractUser
from django.db import models

from Authentication.models import CustomUser


class Recipe(models.Model):
    RecipeId = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100, unique=True)
    Description = models.CharField(max_length=10000)
    Ingredients = models.CharField(max_length=10000)
    Steps = models.CharField(max_length=10000)
    PhotoFileName = models.CharField(max_length=100)
    CreationDate = models.DateField()
    CreatorId = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

