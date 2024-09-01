from django.contrib import admin
from django.urls import path
from Sintonized import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('/', views.AudioCommand.as_view(), name='audio_command'),
]