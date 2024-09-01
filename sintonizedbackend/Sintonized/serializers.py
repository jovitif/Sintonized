from rest_framework import serializers
from .models import AudioCommand

class AudioCommandSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioCommand
        fields = '_all_'