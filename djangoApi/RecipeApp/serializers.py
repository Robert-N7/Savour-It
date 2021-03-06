from rest_framework import serializers

from authentication.models import CustomUser
from RecipeApp.models import Recipe, RecipeImage


class RecipeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeImage
        fields = '__all__'

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance


class RecipeSerializer(serializers.ModelSerializer):
    CreatorName = serializers.SerializerMethodField('get_user_name')
    ImageURL = serializers.SerializerMethodField('get_image_url')

    def get_image_url(self, model):
        """Gets the image url"""
        try:
            image = RecipeImage.objects.get(id=model.PhotoFile_id)
            if image is not None:
                return image.PhotoFile.url
        except (AttributeError, RecipeImage.DoesNotExist) as e:
            print(e)

    def get_user_name(self, model):
        """Gets the username"""
        try:
            user = CustomUser.objects.get(id=model.Creator_id)
            if user is not None:
                return user.username
            print('Failed to get creator name')
        except (AttributeError, CustomUser.DoesNotExist) as e:
            print(e)

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
                  'CreatorName',
                  'ImageURL')

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance
