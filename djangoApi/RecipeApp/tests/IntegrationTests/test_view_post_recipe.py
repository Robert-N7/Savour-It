from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate

from Authentication.models import CustomUser
from Authentication.serializers import CustomUserSerializer
from RecipeApp.views import PostRecipe


class TestViewPostRecipe(APITestCase):
    RECIPE_DATA = {'Name': 'Baked Chicken',
                        'Description': 'A nice fresh-baked chicken',
                        'Ingredients': 'Chicken 2 Lbs\nBrown Sugar 1 Tbs\nPaprika 1 Ts\nGarlic Powder 1/2 Ts\nOnion Powder 1/2 Ts\nSalt 1 Ts\nBlack Pepper 1/4 Ts\nOlive Oil 1 Tbs',
                        'Steps': '1. Preheat oven to 425°F | 220°C (standard ovens) or 390°F | 200°C (fan forced or convection ovens).\n' +
                                 '2. Using a meat mallet or rolling pin, pound each chicken breast to 0.8-inch | 2cm at the thickest part. Make sure your fillets are all the same thickness to ensure even cooking.\n' +
                                 '3. Combine sugar, paprika, oregano, salt, powders, pepper and chili (if using).' +
                                 '4. Line a baking pan with aluminnium foil (or parchment/baking paper). Transfer chicken to the pan and toss chicken in the seasoning. Drizzle with the oil and rub seasoning all over to evenly coat.' +
                                 '5. Bake chicken in preheated oven for 16-18 minutes, or until internal temperature is 165°F (75°C) using a meat thermometer. It should be golden with crisp edges.*' +
                                 '6. Remove parchment paper. Broil (grill) on high heat during the last 2-3 minutes of cooking until golden and crisp.' +
                                 '7. Remove pan from oven, transfer chicken to serving plates and let rest for 5 minutes before serving.' +
                                 '8. OPTIONAL STEP: While chicken is in the oven, melt butter in a small skillet. Sauté garlic until fragrant (30 seconds), and remove pan from heat. Stir in parsley, then pour butter mixture into pan juices, stirring well to combine all of the flavours together.' +
                                 '9. To serve, drizzle pan juices over the chicken and garnish with freshly chopped parsley.',
                        'PhotoFileName': 'BakedChicken.png',
                        'CreationDate': '3/10/2021',
                        'CreatorId': 1
                        }

    def setUp(self):
        """Set up user to reference"""
        self.username = 'ichiro1'
        data = {"email":"ichiro@mariners.com","username": self.username,"password":"konnichiwa"}
        serializer = CustomUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

    def add_recipe(self, data=None):
        url='/recipes/create/'
        user = CustomUser.objects.get(username=self.username)
        if data is None:
            data = self.RECIPE_DATA
        factory = APIRequestFactory()
        request = factory.get(url, data=data, format='json')
        force_authenticate(request, user=user)
        view = PostRecipe.as_view()
        return view(request)

    def test_add_recipe(self):
        """Add recipe, happy path"""
        response = self.add_recipe()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_duplicate(self):
        self.add_recipe()
        response = self.add_recipe()
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_bad_request(self):
        response = self.add_recipe(data={'Data': 'Bad'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {'Name': 'Baked Chicken',
                        'Description': '',
                       'Ingredients': 'Chicken 2 Lbs\nBrown Sugar 1 Tbs\nPaprika 1 Ts\nGarlic Powder 1/2 Ts\nOnion Powder 1/2 Ts\nSalt 1 Ts\nBlack Pepper 1/4 Ts\nOlive Oil 1 Tbs',
                       'Steps': '1. Preheat oven to 425°F | 220°C (standard ovens) or 390°F | 200°C (fan forced or convection ovens).\n' +
                                '2. Using a meat mallet or rolling pin, pound each chicken breast to 0.8-inch | 2cm at the thickest part. Make sure your fillets are all the same thickness to ensure even cooking.\n' +
                                '3. Combine sugar, paprika, oregano, salt, powders, pepper and chili (if using).' +
                                '4. Line a baking pan with aluminnium foil (or parchment/baking paper). Transfer chicken to the pan and toss chicken in the seasoning. Drizzle with the oil and rub seasoning all over to evenly coat.' +
                                '5. Bake chicken in preheated oven for 16-18 minutes, or until internal temperature is 165°F (75°C) using a meat thermometer. It should be golden with crisp edges.*' +
                                '6. Remove parchment paper. Broil (grill) on high heat during the last 2-3 minutes of cooking until golden and crisp.' +
                                '7. Remove pan from oven, transfer chicken to serving plates and let rest for 5 minutes before serving.' +
                                '8. OPTIONAL STEP: While chicken is in the oven, melt butter in a small skillet. Sauté garlic until fragrant (30 seconds), and remove pan from heat. Stir in parsley, then pour butter mixture into pan juices, stirring well to combine all of the flavours together.' +
                                '9. To serve, drizzle pan juices over the chicken and garnish with freshly chopped parsley.',
                       'PhotoFileName': 'BakedChicken.png',
                       'CreationDate': '3/10/2021',
                       'CreatorId': 1
                       }
        response = self.add_recipe(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)