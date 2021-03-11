from rest_framework import serializers
from RecipeApp.models import Recipe


class RecipeSerializer(serializers.Serializer):
    class Meta:
        model = Recipe
        fields = ('RecipeId',
                  'Name',
                  'Description',
                  'Ingredients',
                  'Steps',
                  'PhotoFileName',
                  'CreationDate'
                  'CreatorId')
