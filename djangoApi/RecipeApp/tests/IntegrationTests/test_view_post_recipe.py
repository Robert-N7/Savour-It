from django.test import TestCase
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate

from authentication.models import CustomUser
from authentication.serializers import CustomUserSerializer
from RecipeApp.models import Recipe
from RecipeApp.views import PostRecipe


class TestViewPostRecipe(APITestCase):
    fixtures = ['user_single.json', 'baked_chicken.json', 'baked_chicken_image.json']
    data = {'Name': 'Toast',
            'Description': 'Toasted Bread',
            'Ingredients': 'Slice of Bread\nButter',
            'Steps': '1.Toast the bread\n2.Butter',
            'Creator': 1,
            }

    def setUp(self):
        """Setup by authenticating the user first"""
        super().setUp()
        response = self.client.post('/api/token/obtain/', {'username': 'ichiro1', 'password': 'konnichiwa'})
        if response.status_code != status.HTTP_200_OK:
            raise Exception(f'Failed to authenticate: {response.data}')
        self.client.credentials(HTTP_AUTHORIZATION="JWT " + response.data['access'])

    def add_recipe(self, data=None):
        url='/api/recipes/create/'
        user = CustomUser.objects.all()[0]
        if data is None:
            data = self.data
        return self.client.post(url, data, format='json')

    def test_add_recipe(self):
        """Add recipe, happy path"""
        response = self.add_recipe()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Ensure it is in database
        try:
            Recipe.objects.get(Name=self.data['Name'])
        except Recipe.DoesNotExist:
            raise ValueError('test_add: Failed to find added recipe in database')

    def test_add_duplicate(self):
        self.add_recipe()
        response = self.add_recipe()
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_bad_request(self):
        response = self.add_recipe(data={'Data': 'Bad'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_success(self):
        self.add_recipe()
        data = {'Name': 'Toast',
                'Description': 'A piece of toasted bread',
                'Ingredients': 'Slice of Bread\nButter',
                'Steps': '1.Toast the bread\n2.Butter\n3.Eat',
                }
        response = self.client.put('/api/recipes/create/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensure it is in database
        try:
            recipe = Recipe.objects.get(Name=data['Name'])
            self.assertEqual(data['Description'], recipe.Description)
        except Recipe.DoesNotExist:
            raise ValueError('test_add: Failed to find added recipe in database')

    def test_put_not_found(self):
        self.add_recipe()
        data = {'Name': 'Toe',
                'Description': 'A piece of toasted bread',
                'Ingredients': 'Slice of Bread\nButter',
                'Steps': '1.Toast the bread\n2.Butter\n3.Eat',
                }
        response = self.client.put('/api/recipes/create/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

