from django.shortcuts import render
from .models import AudioCommand
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import AudioCommandSerializer

# WIP
def generate_audio_params(command):
    if command == 'play':
        return {'song': 'song.mp3'}
    elif command == 'pause':
        return {'action': 'pause'}
    elif command == 'stop':
        return {'action': 'stop'}
    else:
        return None

# Create your views here.
class AudioCommandView(APIView):
    def post(self, request):
        command = request.data.get('command')

        audio_params = generate_audio_params(command)

        if audio_params:
            audio_command = AudioCommand.objects.create(command=command, parameters=audio_params)
            serializer = AudioCommandSerializer(audio_command)
            return Response(serializer.data)
        else:
            return Response({"error": "Error generating audio parameters"}, status=500)
# Create your views here.
