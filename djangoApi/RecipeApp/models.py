from django.conf.global_settings import STATIC_ROOT
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import FileSystemStorage
from django.db import models

from authentication.models import CustomUser
from djangoApi import settings


class RecipeImage(models.Model):
    """Recipe Image Model"""
    PhotoFile = models.ImageField(storage=FileSystemStorage(), null=True)


class Recipe(models.Model):
    """Recipe model"""
    RecipeId = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100, unique=True)
    Description = models.CharField(max_length=10000, null=True)
    Ingredients = models.CharField(max_length=10000)
    Steps = models.CharField(max_length=10000)
    PhotoFile = models.ForeignKey(RecipeImage, on_delete=models.CASCADE, null=True)
    CreationDate = models.DateField(auto_now=True)
    Creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.Name
