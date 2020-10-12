import asyncio
import logging
import re

from django.db import transaction

from minerva.core.models import AppUser, User, Message, Hashtag, ChatGroup


def add_user(chat_app, chat_group_id, user_app_id, user_name, user_phone=None, user_email=None):
    chat_group = ChatGroup.objects.get(application=chat_app, app_chat_id=chat_group_id)
    app_user = AppUser.objects.filter(user_app_id=user_app_id, app=chat_app)

    if app_user:
        user = app_user.user
    else:
        user = User.objects.create(name=user_name, phone_number=user_phone, email=user_email)
        AppUser.objects.create(app=chat_app, user=user, user_app_id=user_app_id)

    chat_group.members.add(user)


def store_message(chat_app, chat_group_id, chat_group_name, message_id, message_content, sender_id, sender_name,
                  message_date, sender_obj=None, new_user_callback=None, reply_message_id=None, edit_date=None,
                  sender_email=None):
    chat_group, group_created = ChatGroup.objects.get_or_create(application_id=chat_app.id,
                                                                app_chat_id=chat_group_id)
    if group_created or chat_group.name != chat_group_name:
        chat_group.name = chat_group_name
        chat_group.save()

    message = Message.objects.filter(app_message_id=message_id, chat_group=chat_group).first()

    if not message:
        app_sender = AppUser.objects.filter(app=chat_app, user_app_id=sender_id).first()
        if not app_sender:
            try:
                with transaction.atomic():
                    new_user = User.objects.create_user(username=sender_name, email=sender_email)
                    app_sender = AppUser.objects.create(
                        user=new_user,
                        app=chat_app,
                        user_app_id=sender_id
                    )
                    if new_user_callback:
                        asyncio.run(new_user_callback(sender_obj, new_user))
            except Exception as e:
                logging.error('Error occurred storing new User: %s', e)
                return None

        reply_to = None
        if reply_message_id:
            reply_to = Message.objects.filter(app_message_id=reply_message_id,
                                              chat_group=chat_group).first()

        message = Message(
            app_message_id=message_id,
            sent_date=message_date,
            last_updated=message_date,
            chat_group=chat_group,
            sent_by=app_sender.user,
            reply_to=reply_to
        )

    message.content = message_content

    if edit_date:
        message.last_updated = edit_date

    message.save()

    if not chat_group.members.filter(pk=message.sent_by.id).exists():
        chat_group.members.add(message.sent_by)
        chat_group.save()

    for hashtag_content in re.findall(r"#(\w+)", message_content):
        hashtag, _ = Hashtag.objects.get_or_create(content=hashtag_content)
        message.hashtags.add(hashtag)

    return message
