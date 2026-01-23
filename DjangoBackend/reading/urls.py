from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

r = DefaultRouter()
r.register('parts', views.PartViewSet, basename='passage')
r.register('questions', views.QuestionViewSet, basename='question')
r.register('part-histories', views.PartHistoryViewSet, basename='part-history')
r.register('geminis', views.GeminiViewSet, basename='gemini')


urlpatterns = [
    path('', include(r.urls)),
]
