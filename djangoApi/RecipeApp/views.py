from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import CustomUser
from authentication.serializers import CustomUserSerializer
from RecipeApp.models import Recipe
from RecipeApp.serializers import RecipeSerializer


# Create your views here.

class PostRecipe(APIView):
    """API view for creating and updating recipes"""
    #permission_classes = (permissions.IsAuthenticated,)

    def parse_json(self, request):
        """Parses the json request, adding creator as needed
            throws: ValueError if it failed to parse to dictionary or is missing name
        """
        recipe_data = JSONParser().parse(request)
        if type(recipe_data) is not dict:
            raise ValueError('Parsed Json is not a dictionary')
        if not recipe_data.get('Name'):
            raise ValueError('Missing recipe name')
        creator = recipe_data.get('Creator')
        if creator is None:
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
            return Response('Added Successfully!', status=status.HTTP_200_OK)
        return Response(recipe_data, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format='json'):
        """Updates a recipe, put request"""
        try:
            recipe_data = self.parse_json(request)
        except ValueError as e:
            return Response(str(e), status.HTTP_400_BAD_REQUEST)
        try:
            recipe = Recipe.objects.get(RecipeId=recipe_data['RecipeId'])
            # only let them modify it if they created it!
            if recipe.Creator != recipe_data['Creator']:
                return Response(status=status.HTTP_403_FORBIDDEN)
        except Recipe.DoesNotExist:
            return Response(recipe_data, status=status.HTTP_404_NOT_FOUND)
        recipe_serializer = RecipeSerializer(recipe, data=recipe_data)
        if recipe_serializer.is_valid():
            recipe_serializer.save()
            return Response('Successfully updated!', status=status.HTTP_200_OK)
        return Response(recipe_data, status=status.HTTP_400_BAD_REQUEST)


class RecipeView(APIView):
    serializer_class = RecipeSerializer

    def get(self, request, *args, **kwargs):
        """Recipe API for getting the backend recipes"""
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
