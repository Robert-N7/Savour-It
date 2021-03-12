from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate

from Authentication.models import CustomUser
from Authentication.serializers import CustomUserSerializer
from RecipeApp.models import Recipe
from RecipeApp.views import PostRecipe


class TestViewPostRecipe(APITestCase):
    fixtures = ['user_single.json', 'baked_chicken.json']
    data = {'Name': 'Toast',
            'Description': 'Toasted Bread',
            'Ingredients': 'Slice of Bread\nButter',
            'Steps': '1.Toast the bread\n2.Butter',
            'Creator': 1,
            'PhotoFileName': 'toast.png'}

    def add_recipe(self, data=None):
        url='/recipes/create/'
        user = CustomUser.objects.all()[0]
        if data is None:
            data = self.data
        data['Creator'] = user.id
        return self.client.post(url, data, 'json')
        # factory = APIRequestFactory()
        # request = factory.get(url, data=data, format='json')
        # force_authenticate(request, user=user)
        # view = PostRecipe.as_view()
        # return view(request)

    def test_add_recipe(self):
        """Add recipe, happy path"""
        response = self.add_recipe()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
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
