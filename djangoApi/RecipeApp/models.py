from django.contrib.auth.models import AbstractUser
from django.db import models

from Authentication.models import CustomUser
from djangoApi import settings


class Recipe(models.Model):
    RecipeId = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100, unique=True)
    Description = models.CharField(max_length=10000, null=True)
    Ingredients = models.CharField(max_length=10000)
    Steps = models.CharField(max_length=10000)
    PhotoFileName = models.CharField(max_length=100, null=True)
    CreationDate = models.DateField(auto_now=True)
    Creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

