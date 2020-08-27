from datetime import datetime

import pytz
from django.test import TestCase

from minerva.classifier import heuristics
from minerva.core import models
from minerva.core.models import ChatApp, Discussion, Hashtag


class HashtagClassifierTest(TestCase):
    def setUp(self) -> None:
        self.chat_app = ChatApp.objects.create(name="Telegram")

        self.group_name = "test_group"
        self.sender_name = "John Smith"
        self.test_time = datetime.now(pytz.utc)

    def test_classify_message_no_hashtags(self):
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

        self.assertEquals(new_message.hashtags.all().count(), 0)

        classifications = heuristics.HashtagClassifier().classify(new_message)
        self.assertEquals(len(classifications), 0)

    def test_classify_message_one_hashtag(self):
        message_content = "hello world #just_you_wait"
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

        self.assertEquals(new_message.hashtags.all().count(), 1)

        classifications = heuristics.HashtagClassifier().classify(new_message)
        self.assertEquals(len(classifications), 1)

        expected_hashtag, is_new = Hashtag.objects.get_or_create('just_you_wait')
        self.assertFalse(is_new)

        expected_discussion = Discussion(new_message, expected_hashtag)

        self.assertEquals(classifications, [heuristics.ClassificationResult(expected_discussion, 1, True)])

    def test_classify_message_two_hashtags(self):
        message_content = "hello world #just_you_wait #MyShot"
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

        self.assertEquals(new_message.hashtags.all().count(), 2)

        classifications = heuristics.HashtagClassifier().classify(new_message)
        self.assertEquals(len(classifications), 2)

        expected_hashtag_1, is_new = Hashtag.objects.get_or_create(content='just_you_wait')
        self.assertFalse(is_new)
        expected_discussion_1 = Discussion(new_message, expected_hashtag_1)

        expected_hashtag_2, is_new = Hashtag.objects.get_or_create(content='MyShot')
        self.assertFalse(is_new)
        expected_discussion_2 = Discussion(new_message, expected_hashtag_2)

        self.assertEquals(classifications, [heuristics.ClassificationResult(expected_discussion_1, 1, True),
                                            heuristics.ClassificationResult(expected_discussion_2, 1, True)])


class ReplyClassifierTest(TestCase):
    pass
