from rest_framework.test import APITestCase

from RecipeApp import models
from RecipeApp.serializers import RecipeSerializer


class TestRecipeSerializer(APITestCase):
    fixtures = ['user_single.json', 'baked_chicken.json', 'baked_chicken_image.json']

    def setUp(self):
        self.model = models.Recipe.objects.all()[0]
        self.serializer = RecipeSerializer(self.model)

    def test_get_image_url(self):
        url = self.serializer.get_image_url(self.model)
        self.assertEqual(url, "/media/download_1orK6GT.jpg")

    def test_get_user_name(self):
        name = self.serializer.get_user_name(self.model)
        self.assertEqual(name, 'ichiro1')
