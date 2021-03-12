from rest_framework import status
from rest_framework.test import APITestCase


class TestViewGetRecipe(APITestCase):
    fixtures = ['user_single.json', 'baked_chicken.json']

    def test_get_all(self):
        """Test getting all the recipes"""
        response = self.client.get('/recipes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single(self):
        """Test getting single recipe"""
        response = self.client.get('/recipes/recipe/Baked Chicken/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)