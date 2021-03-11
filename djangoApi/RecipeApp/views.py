from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from RecipeApp.models import Recipe, CustomUser
from RecipeApp.serializers import RecipeSerializer


# Create your views here.

class PostRecipe(APIView):
    #permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format='json'):
        """Creates recipe, post api request"""
        recipe_data = JSONParser().parse(request)
        recipe_serializer = RecipeSerializer(data=recipe_data)
        if recipe_serializer.is_valid():
            try:
                recipe_serializer.save()
                return Response('Added Successfully!', status=status.HTTP_200_OK)
            except IntegrityError:
                return Response('Duplicate recipe named ' + recipe_data['Name'], status=status.HTTP_409_CONFLICT)
        return Response(recipe_data, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format='json'):
        """Updates a recipe, put request"""
        recipe_data = JSONParser.parse(request)
        try:
            recipe = Recipe.objects.get(RecipeId=recipe_data['RecipeId'])
        except Recipe.DoesNotExist:
            return Response(recipe_data, status=status.HTTP_404_NOT_FOUND)
        recipe_serializer = RecipeSerializer(recipe, data=recipe_data)
        if recipe_serializer.is_valid():
            recipe_serializer.save()
            return Response('Successfully updated!', status=status.HTTP_200_OK)
        return Response(recipe_data, status=status.HTTP_400_BAD_REQUEST)


class RecipeView(APIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        self.name = self.kwargs['name']


    def get(self, request, format='json'):
        """Recipe API for getting the backend recipes"""
        name = self.name
        if name == '':
            recipes = Recipe.objects.all()
            recipe_serializer = RecipeSerializer(recipes, many=True)
            return JsonResponse(recipe_serializer.data, safe=False)
        else:
            try:
                recipe = Recipe.objects.get(name)
                recipe_serializer = RecipeSerializer(recipe)
                return JsonResponse(recipe_serializer.data)
            except Recipe.DoesNotExit:
                return Response('Recipe not found', status=status.HTTP_404_NOT_FOUND)
