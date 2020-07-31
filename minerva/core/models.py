from django.db import models


class Message(models.Model):
    sent_date = models.DateTimeField(null=False)
    received_date = models.DateTimeField(null=False)
    last_updated = models.DateTimeField(null=False)
    content = models.TextField(null=False, blank=False)
    normalized_content = models.TextField(null=True, blank=False)
    chat_group = models.ForeignKey('ChatGroup', null=False, on_delete=models.CASCADE)
    sent_by = models.ForeignKey('User', null=False, on_delete=models.DO_NOTHING)
    reply_to = models.ForeignKey('self', null=True, on_delete=models.SET_NULL, related_name='replies')
    conversation = models.ForeignKey('Conversation', null=True, on_delete=models.DO_NOTHING)
    hashtags = models.ManyToManyField('Hashtag', null=True)


class Conversation(models.Model):
    first_message = models.ForeignKey('Message', null=False, on_delete=models.DO_NOTHING, related_name='+')
    hashtag = models.ForeignKey('Hashtag', null=False, on_delete=models.CASCADE)


class Hashtag(models.Model):
    content = models.TextField(null=False, blank=False, unique=True)


class User(models.Model):
    name = models.TextField(null=True, blank=True)
    user_identifier = models.TextField(null=False, help_text="mostly phone number, can be email if necessary")
    applications = models.ManyToManyField('ChatApp', null=False, related_name='users')


class ChatApp(models.Model):
    name = models.TextField(null=False, blank=False)
    bot_token = models.TextField(null=False, blank=False)


class ChatGroup(models.Model):
    name = models.TextField(null=True, blank=True)
    application = models.ForeignKey('ChatApp', null=False, on_delete=models.CASCADE, related_name='chat_groups')
    members = models.ManyToManyField('User', null=False, related_name='chat_groups')
