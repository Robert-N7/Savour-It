import os

import PIL
import rest_framework_simplejwt
from django import http
from django.http import JsonResponse
from django.views.generic import DetailView
from rest_framework import permissions, status
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from RecipeApp.models import Recipe, RecipeImage
from RecipeApp.serializers import RecipeSerializer, RecipeImageSerializer


# Create your views here.
from djangoApi.settings import MEDIA_ROOT


class ImageView(APIView):
    """Api for getting images from the Media Root, only jpg and png are allowed"""
    def get(self, request, *args, **kwargs):
        name = self.kwargs.get('name')
        if name is not None:
            path = os.path.join(MEDIA_ROOT, name)
            if not os.path.exists(path):
                return Response(request.data, status.HTTP_404_NOT_FOUND)
            ext = os.path.splitext(name)[1]
            # Only allow jpg and png
            if ext != '.jpg' and ext != '.png':
                return Response(request.data, status.HTTP_400_BAD_REQUEST)
            content_type = 'image/png' if ext == '.png' else 'image/jpeg'
            with open(path, 'rb') as img:
                return http.HttpResponse(img.read(), content_type=content_type)
        return Response(request.data, status.HTTP_400_BAD_REQUEST)


class UploadImage(APIView):
    """
    Api for uploading images
    url: /api/recipes/upload/
    """
    authentication_classes = (rest_framework_simplejwt.authentication.JWTAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format='multipart/form-data'):
        """ Post request to upload
            :returns response id corresponding to the file
        """
        serializer = RecipeImageSerializer(data=request.data)
        if serializer.is_valid():
            model = serializer.save()
            return Response(model.id, status.HTTP_201_CREATED)
        return Response(serializer.data, status.HTTP_400_BAD_REQUEST)


class PostRecipe(APIView):
    """
    API view for creating and updating recipes
    url: /api/recipes/create/
    """
    # This api unlike others requires you to be logged in with JWT authentication
    authentication_classes = (rest_framework_simplejwt.authentication.JWTAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    # parser_classes = (MultiPartParser, FormParser)

    def parse_json(self, request):
        """Parses the json request, adding creator as needed
            throws: ValueError if it failed to parse to dictionary or is missing name
        """
        recipe_data = JSONParser().parse(request)
        if type(recipe_data) is not dict:
            raise ValueError('Parsed Json is not a dictionary')
        if not recipe_data.get('Name'):
            raise ValueError('Missing recipe name')
        recipe_data['Creator'] = request.user.id
        return recipe_data

    def post(self, request, format='json'):
        """Creates recipe, post api request"""
        try:
            recipe_data = self.parse_json(request)
        except ValueError as e:
            return Response(str(e), status.HTTP_400_BAD_REQUEST)
        # Check for duplicate
        if Recipe.objects.filter(Name=recipe_data['Name']).exists():
            return Response('Duplicate recipe named ' + recipe_data['Name'], status=status.HTTP_409_CONFLICT)
        recipe_serializer = RecipeSerializer(data=recipe_data)
        if recipe_serializer.is_valid():
            recipe_serializer.save()
            return Response('Added Successfully!', status=status.HTTP_201_CREATED)
        return Response(recipe_serializer.data, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Updates a recipe, put request"""
        try:
            recipe_data = self.parse_json(request)
        except ValueError as e:
            return Response(str(e), status.HTTP_400_BAD_REQUEST)
        try:
            recipe = Recipe.objects.get(Name=recipe_data.get('Name'))
        except Recipe.DoesNotExist:
            return Response(recipe_data, status=status.HTTP_404_NOT_FOUND)
        # only let them modify it if they created it!
        if recipe.Creator_id != recipe_data['Creator']:
            return Response(status=status.HTTP_403_FORBIDDEN)
        recipe_serializer = RecipeSerializer(recipe, data=recipe_data)
        if recipe_serializer.is_valid():

            recipe_serializer.save()
            return Response('Successfully updated!', status=status.HTTP_200_OK)
        return Response(recipe_data, status=status.HTTP_400_BAD_REQUEST)


class RecipeView(APIView):
    serializer_class = RecipeSerializer

    def get(self, request, *args, **kwargs):
        """
        Recipe API for getting the backend recipes
        :param **kwargs can have a name parameter to specify a recipe to get
        """
        name = self.kwargs.get('name')
        if name is None:
            recipes = Recipe.objects.all()
            recipe_serializer = RecipeSerializer(recipes, many=True)
            return JsonResponse(recipe_serializer.data, safe=False)
        else:
            try:
                recipe = Recipe.objects.get(Name=name)
                recipe_serializer = RecipeSerializer(recipe)
                return JsonResponse(recipe_serializer.data)
            except Recipe.DoesNotExist:
                return Response('Recipe not found', status=status.HTTP_404_NOT_FOUND)
