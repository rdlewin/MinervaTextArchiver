from datetime import datetime

import pytz
from django.test import TestCase

from minerva.core import utils
from minerva.core.models import Message, ChatApp, User, ChatGroup, AppUser


class CoreModelTestCase(TestCase):
    def setUp(self):
        self.chat_app = ChatApp.objects.create(name="Telegram")
        self.chat_app.save()

        self.group_name = "test_group"
        self.sender_name = "John Smith"
        self.test_time = datetime.now(pytz.utc)

    def test_store_message_new_env(self):
        message_content = "hello world"
        group_id = 123
        sender_id = 1234
        message_id = 12345

        new_message = utils.store_message(self.chat_app,
                                          group_id,
                                          self.group_name,
                                          message_id,
                                          message_content,
                                          sender_id,
                                          self.sender_name,
                                          self.test_time)

        self.assertEquals(new_message.content, message_content)
        self.assertEquals(Message.objects.filter(id=new_message.id).count(), 1)
        self.assertEquals(new_message.hashtags.all().count(), 0)

    def test_store_message_existing_group_and_user(self):
        sender = User.objects.create(username=self.sender_name)
        app_user = AppUser.objects.create(app=self.chat_app, user=sender, user_app_id=123)
        new_group = ChatGroup.objects.create(app_chat_id=1,
                                             name=self.group_name,
                                             application=self.chat_app)
        new_group.members.add(sender)
        new_group.save()

        message_content = "hello world"
        message_id = 12345

        new_message = utils.store_message(self.chat_app,
                                          new_group.id,
                                          new_group.name,
                                          message_id,
                                          message_content,
                                          app_user.user_app_id,
                                          sender.username,
                                          self.test_time)

        self.assertEquals(new_message.content, message_content)
        self.assertEquals(Message.objects.filter(id=new_message.id).count(), 1)

    def test_store_message_multiple_hashtags(self):
        message_content = "hello world #just_you_wait #MyShot"
        group_id = 123
        sender_id = 1234
        message_id = 12345

        new_message = utils.store_message(self.chat_app,
                                          group_id,
                                          self.group_name,
                                          message_id,
                                          message_content,
                                          sender_id,
                                          self.sender_name,
                                          self.test_time)

        self.assertEquals(list(new_message.hashtags.all().values_list('content', flat=True)),
                          ['just_you_wait', 'MyShot'])
