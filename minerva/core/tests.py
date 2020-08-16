from datetime import datetime

import pytz
from django.test import TestCase

from minerva.core import models
from minerva.core.models import Message, ChatApp, User, ChatGroup


class CoreModelTestCase(TestCase):
    def setUp(self):
        self.chat_app = ChatApp.objects.create(name="Telegram")

        self.group_name = "test_group"
        self.sender_name = "John Smith"
        self.test_time = datetime.now(pytz.utc)

    def test_store_message_new_env(self):
        message_content = "hello world"
        group_id = 123
        sender_id = 1234
        message_id = 12345

        new_message = models.store_message(self.chat_app,
                                           group_id,
                                           self.group_name,
                                           message_id,
                                           message_content,
                                           sender_id,
                                           self.sender_name,
                                           self.test_time)

        self.assertEquals(new_message.content, message_content)
        self.assertEquals(Message.objects.filter(id=new_message.id).count(), 1)

    def test_store_message_existing_group_and_user(self):
        sender = User.objects.create(name=self.sender_name)
        new_group = ChatGroup.objects.create(app_chat_id=1,
                                             name=self.group_name,
                                             application=self.chat_app)
        new_group.members.add(sender)
        new_group.save()

        message_content = "hello world"
        message_id = 12345

        new_message = models.store_message(self.chat_app,
                                           new_group.id,
                                           new_group.name,
                                           message_id,
                                           message_content,
                                           sender.id,
                                           sender.name,
                                           self.test_time)

        self.assertEquals(new_message.content, message_content)
        self.assertEquals(Message.objects.filter(id=new_message.id).count(), 1)
