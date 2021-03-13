from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.test import APITestCase

from authentication.models import CustomUser


class TestApiToken(APITestCase):
    """
        Test obtaining and refreshing access tokens
    """
    fixtures = ('user_single.json',)

    def test_token_obtain(self):
        """Test obtain token api"""
        user = CustomUser.objects.all()[0]
        response = self.client.post('/token/obtain/', data={'username': user.username, 'password': user.password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_refresh(self):
        """Test refresh token api"""
        user = CustomUser.objects.all()[0]
        response = self.client.post('/token/refresh/', data={'username': user.username, 'password': user.password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

