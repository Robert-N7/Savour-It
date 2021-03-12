
from rest_framework import serializers

from Authentication.models import CustomUser
from RecipeApp.models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ('RecipeId',
                  'Name',
                  'Description',
                  'Ingredients',
                  'Steps',
                  'PhotoFileName',
                  'CreationDate',
                  'Creator')

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance


