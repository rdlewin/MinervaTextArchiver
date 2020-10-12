from datetime import datetime

import pytz
from django.test import TestCase

from minerva.classifier import heuristics
from minerva.core import utils
from minerva.core.models import ChatApp, Discussion, Hashtag


class ClassifierTestCase(TestCase):
    def setUp(self) -> None:
        self.chat_app = ChatApp.objects.create(name="Telegram")

        self.group_name = "test_group"
        self.sender_name = "John Smith"
        self.test_time = datetime.now(pytz.utc)


class HashtagClassifierTest(ClassifierTestCase):
    def test_classify_message_no_hashtags(self):
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

        self.assertEquals(new_message.hashtags.all().count(), 0)

        classifications = heuristics.HashtagClassifier().classify(new_message)
        self.assertEquals(len(classifications), 0)

    def test_classify_message_one_hashtag(self):
        message_content = "hello world #just_you_wait"
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
                                          self.test_time,
                                          None)

        self.assertEquals(new_message.hashtags.all().count(), 1)

        classifications = heuristics.HashtagClassifier().classify(new_message)
        self.assertEquals(len(classifications), 1)

        expected_hashtag, is_new = Hashtag.objects.get_or_create('just_you_wait')
        self.assertFalse(is_new)

        self.assertEquals(classifications[0].confidence, 1)
        self.assertTrue(classifications[0].is_new)
        self.assertEquals(classifications[0].discussion.first_message, new_message)
        self.assertEquals(classifications[0].discussion.hashtag, expected_hashtag)

    def test_classify_message_two_hashtags(self):
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
                                          self.test_time,
                                          None)

        self.assertEquals(new_message.hashtags.all().count(), 2)

        classifications = heuristics.HashtagClassifier().classify(new_message)
        self.assertEquals(len(classifications), 2)

        expected_hashtag_1, is_new = Hashtag.objects.get_or_create(content='just_you_wait')
        self.assertFalse(is_new)
        expected_discussion_1 = Discussion(first_message=new_message, hashtag=expected_hashtag_1)

        expected_hashtag_2, is_new = Hashtag.objects.get_or_create(content='MyShot')
        self.assertFalse(is_new)
        expected_discussion_2 = Discussion(first_message=new_message, hashtag=expected_hashtag_2)

        self.assertEquals(classifications, [heuristics.ClassificationResult(expected_discussion_1, 1, True),
                                            heuristics.ClassificationResult(expected_discussion_2, 1, True)])


class ReplyClassifierTest(ClassifierTestCase):
    def test_not_a_reply(self):
        message_content = "I'm an orphan"
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
                                          self.test_time,
                                          None)

        self.assertEquals(new_message.reply_to, None)
        classifications = heuristics.ReplyClassifier().classify(new_message)

        self.assertEquals(classifications, [])

    def test_no_discussion_for_parent_message(self):
        message_content = "My parent has no discussions"
        group_id = 123
        sender_id = 1234
        message_id = 12345

        parent_message = utils.store_message(self.chat_app,
                                             group_id,
                                             self.group_name,
                                             message_id,
                                             message_content,
                                             sender_id,
                                             self.sender_name,
                                             self.test_time,
                                             None)

        new_message = utils.store_message(self.chat_app,
                                          group_id,
                                          self.group_name,
                                          message_id + 1,
                                          message_content,
                                          sender_id,
                                          self.sender_name,
                                          self.test_time,
                                          None,
                                          reply_message_id=parent_message.app_message_id)

        num_of_parent_discussions = new_message.reply_to.discussions.all().count()
        self.assertEquals(num_of_parent_discussions, 0)
        classifications = heuristics.ReplyClassifier().classify(new_message)

        self.assertEquals(classifications, [])

    def test_single_discussion_for_parent(self):
        message_content = "My parent belongs to 1 discussions"
        group_id = 123
        sender_id = 1234
        message_id = 12345

        parent_message = utils.store_message(self.chat_app,
                                             group_id,
                                             self.group_name,
                                             message_id,
                                             message_content,
                                             sender_id,
                                             self.sender_name,
                                             self.test_time,
                                             None)

        parent_discussion = Discussion.objects.create(first_message=parent_message, hashtag=None)
        parent_message.discussions.add(parent_discussion)

        new_message = utils.store_message(self.chat_app,
                                          group_id,
                                          self.group_name,
                                          message_id + 1,
                                          message_content,
                                          sender_id,
                                          self.sender_name,
                                          self.test_time,
                                          None,
                                          reply_message_id=parent_message.app_message_id)

        num_of_parent_discussions = new_message.reply_to.discussions.all().count()
        self.assertEquals(num_of_parent_discussions, 1)
        classifications = heuristics.ReplyClassifier().classify(new_message)
        self.assertEquals(len(classifications), 1)

        self.assertEquals(classifications, [heuristics.ClassificationResult(parent_discussion, 1, False)])

    def test_two_discussions_for_parent(self):
        message_content = "My parent belongs to 2 discussions"
        group_id = 123
        sender_id = 1234
        message_id = 12345

        parent_message = utils.store_message(self.chat_app,
                                             group_id,
                                             self.group_name,
                                             message_id,
                                             message_content,
                                             sender_id,
                                             self.sender_name,
                                             self.test_time,
                                             None)

        parent_discussion_1 = Discussion.objects.create(first_message=parent_message, hashtag=None)
        parent_discussion_2 = Discussion.objects.create(first_message=parent_message, hashtag=None)

        parent_message.discussions.add(parent_discussion_1)
        parent_message.discussions.add(parent_discussion_2)

        new_message = utils.store_message(self.chat_app,
                                          group_id,
                                          self.group_name,
                                          message_id + 1,
                                          message_content,
                                          sender_id,
                                          self.sender_name,
                                          self.test_time,
                                          None,
                                          reply_message_id=parent_message.app_message_id)

        num_of_parent_discussions = new_message.reply_to.discussions.all().count()
        self.assertEquals(num_of_parent_discussions, 2)
        classifications = heuristics.ReplyClassifier().classify(new_message)
        self.assertEquals(len(classifications), 2)

        self.assertEquals(classifications, [heuristics.ClassificationResult(parent_discussion_1, 0.5, False),
                                            heuristics.ClassificationResult(parent_discussion_2, 0.5, False)])
