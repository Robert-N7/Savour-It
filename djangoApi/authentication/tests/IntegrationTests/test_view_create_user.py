# Integration Tests
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase


class TestViewCreateUser(APITestCase):
    def test_create_user(self):
        """Ensure we can create"""
        data = {"email": "ichiro@mariners.com", "username": "ichiro1", "password": "konnichiwa"}
        url = '/api/user/create/'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_failed(self):
        """Ensure we can't create an existing user"""
        data = {"email": "ichiro@mar.com", "username": "ichiro2", "password": "konnichiwa"}
        url = '/api/user/create/'
        response = self.client.post(url, data, format='json')
        # Second time should fail
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_create_bad_data(self):
        data = {"email": "ichiro@mar.com", "password": "Konnichiwa"}
        url = '/api/user/create/'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
