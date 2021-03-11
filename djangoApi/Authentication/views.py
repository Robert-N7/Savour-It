from django.db import IntegrityError
from django.shortcuts import render
from rest_framework import permissions, status
from rest_framework.response import Response

from rest_framework.views import APIView

from Authentication.models import CustomUser
from Authentication.serializers import CustomUserSerializer


class CustomUserCreate(APIView):
    """View to create users"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                if user:
                    json = serializer.data
                    return Response(json, status=status.HTTP_201_CREATED)
            except IntegrityError:      # User already exists
                return Response(serializer.data, status=status.HTTP_409_CONFLICT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
