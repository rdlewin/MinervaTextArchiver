import re

from django.db import models


class Message(models.Model):
    app_message_id = models.TextField(null=False)
    sent_date = models.DateTimeField(null=False)
    last_updated = models.DateTimeField(null=False)
    content = models.TextField(null=False, blank=False)
    normalized_content = models.TextField(null=True, blank=False)
    chat_group = models.ForeignKey('ChatGroup', null=False, on_delete=models.CASCADE)
    sent_by = models.ForeignKey('User', null=False, on_delete=models.DO_NOTHING)
    reply_to = models.ForeignKey('self', null=True, on_delete=models.SET_NULL, related_name='replies')
    discussions = models.ManyToManyField('Discussion', related_name='messages')
    hashtags = models.ManyToManyField('Hashtag')


class Discussion(models.Model):
    first_message = models.ForeignKey('Message', null=False, on_delete=models.DO_NOTHING, related_name='+')
    hashtag = models.ForeignKey('Hashtag', null=False, on_delete=models.CASCADE)


class Hashtag(models.Model):
    content = models.TextField(null=False, blank=False, unique=True)


class User(models.Model):
    name = models.TextField(null=True, blank=True)
    phone_number = models.TextField(null=True, blank=False)
    email = models.TextField(null=True, blank=False)


class ChatApp(models.Model):
    name = models.TextField(null=False, blank=False)


class AppUsers(models.Model):
    user = models.ForeignKey('User', null=False, on_delete=models.CASCADE)
    app = models.ForeignKey('ChatApp', null=False, on_delete=models.CASCADE)
    user_app_id = models.TextField(null=False, blank=False)


class ChatGroup(models.Model):
    app_chat_id = models.TextField(null=False, blank=False)
    name = models.TextField(null=True, blank=True)
    application = models.ForeignKey('ChatApp', null=False, on_delete=models.CASCADE, related_name='chat_groups')
    members = models.ManyToManyField('User', related_name='chat_groups')
    hashtags = models.ManyToManyField('Hashtag', related_name='chat_groups')


def store_message(chat_app, chat_group_id, chat_group_name, message_id, message_content, sender_id, sender_name,
                  message_date,
                  reply_message_id=None, edit_date=None):
    chat_group, group_created = ChatGroup.objects.get_or_create(application=chat_app,
                                                                app_chat_id=chat_group_id)
    if group_created:
        chat_group.name = chat_group_name

    new_message = Message.objects.filter(app_message_id=message_id,
                                         chat_group=chat_group).first()

    if not new_message:
        app_sender = AppUsers.objects.filter(app=chat_app, user_app_id=sender_id).first()
        if not app_sender:
            new_user = User.objects.create(name=sender_name)
            app_sender = AppUsers.objects.create(
                user=new_user,
                app=chat_app,
                user_app_id=sender_id
            )

        reply_to = None
        if reply_message_id:
            reply_to = Message.objects.filter(app_message_id=reply_message_id).first()

        new_message = Message(
            app_message_id=message_id,
            sent_date=message_date,
            last_updated=message_date,
            chat_group=chat_group,
            sent_by=app_sender.user,
            reply_to=reply_to
        )

    new_message.content = message_content

    if edit_date:
        new_message.last_updated = edit_date

    new_message.save()

    for hashtag_content in re.findall(r"#(\w+)", message_content):
        hashtag, _ = Hashtag.objects.get_or_create(content=hashtag_content)
        new_message.hashtags.add(hashtag)

    return new_message
