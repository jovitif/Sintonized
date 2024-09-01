from django.db import models

# Create your models here.

class AudioCommand(models.Model):
    command = models.TextField()
    parameters = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)