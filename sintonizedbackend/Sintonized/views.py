import os
import requests
from django.shortcuts import render
from .models import AudioCommand
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import AudioCommandSerializer

# WIP
def generate_audio_params(text):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.environ.get("DJANGO_APP_GEMINI_API_KEY")}' 
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": text}]
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Raise an exception for error HTTP status codes
        response_data = response.json()
        audio_params = response_data['choices'][0]['message']['content']
        return audio_params
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None  # Or handle the error in a more specific way

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
