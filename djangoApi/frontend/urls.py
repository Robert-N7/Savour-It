from django.conf.urls import url
from django.urls import path

from frontend.views import index_view

urlpatterns = [
    path('', index_view),  # for the empty url
    url(r'^.*/$', index_view)  # for all other urls
]