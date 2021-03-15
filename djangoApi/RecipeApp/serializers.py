from rest_framework import serializers

from authentication.models import CustomUser
from RecipeApp.models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    CreatorName = serializers.SerializerMethodField('get_user_name')

    def get_user_name(self, model):
        user = CustomUser.objects.get(id=model.Creator_id)
        if user is not None:
            return user.username
        print('Failed to get creator name')

    class Meta:
        model = Recipe
        fields = ('RecipeId',
                  'Name',
                  'Description',
                  'Ingredients',
                  'Steps',
                  'PhotoFile',
                  'CreationDate',
                  'Creator',
                  'CreatorName')

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance
