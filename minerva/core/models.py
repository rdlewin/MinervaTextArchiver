from django.contrib.auth.models import AbstractUser
from django.db import models


class Message(models.Model):
    app_message_id = models.CharField(null=False, max_length=64)
    sent_date = models.DateTimeField(null=False)
    last_updated = models.DateTimeField(null=False)
    content = models.TextField(null=False, blank=False)
    normalized_content = models.TextField(null=True, blank=True)
    chat_group = models.ForeignKey('ChatGroup', null=False, blank=False, on_delete=models.CASCADE)
    sent_by = models.ForeignKey('User', null=False, blank=False, on_delete=models.CASCADE)
    reply_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='replies')
    discussions = models.ManyToManyField('Discussion', related_name='messages', blank=True)
    hashtags = models.ManyToManyField('Hashtag', blank=True)

    def __str__(self):
        presentation_length = 64
        brief_content = (self.content[:presentation_length] + '..') if len(self.content) > 75 else self.content
        return f'{self.id}. {brief_content}'


class Discussion(models.Model):
    first_message = models.ForeignKey('Message', null=False, on_delete=models.DO_NOTHING, related_name='+')
    hashtag = models.ForeignKey('Hashtag', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        if not self.hashtag:
            return str(self.id)

        return f'{self.id}. {self.hashtag.content}'


class Hashtag(models.Model):
    content = models.TextField(null=False, blank=False, unique=True)

    def __str__(self):
        return f'{self.id}. {self.content}'


class User(AbstractUser):
    phone_number = models.CharField(null=True, blank=True, max_length=20)

    def __str__(self):
        return f'{self.id}. {self.username}'


class ChatApp(models.Model):
    name = models.CharField(null=False, blank=False, max_length=128)

    def __str__(self):
        return f'{self.id}. {self.name}'


class AppUser(models.Model):
    user = models.ForeignKey('User', null=False, on_delete=models.CASCADE)
    app = models.ForeignKey('ChatApp', null=False, on_delete=models.CASCADE)
    user_app_id = models.CharField(null=False, blank=False, max_length=64)


class ChatGroup(models.Model):
    app_chat_id = models.CharField(null=False, blank=False, max_length=64)
    name = models.CharField(null=True, blank=True, max_length=128)
    application = models.ForeignKey('ChatApp', null=False, on_delete=models.CASCADE, related_name='chat_groups')
    members = models.ManyToManyField('User', related_name='chat_groups')
    hashtags = models.ManyToManyField('Hashtag', related_name='chat_groups', blank=True)

    def __str__(self):
        return f'{self.id}. {self.name}'
