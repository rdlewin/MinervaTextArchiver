from datetime import datetime

import pytz
from django.test import TestCase
from rest_framework.reverse import reverse
from rest_framework.test import APIClient

from minerva.core import models
from minerva.core.models import User, ChatGroup, ChatApp, Discussion, Hashtag
from minerva.webapp.tests.stubs import message_factory


class ApiTestCase(TestCase):
    def setUp(self):
        self.maxDiff = None
        self.client = APIClient()
        self.chat_app = ChatApp.objects.create(name="Telegram")

        self.user = User.objects.create(name='Alexander Hamilton')
        self.group = ChatGroup.objects.create(app_chat_id=self.chat_app.id,
                                              name='MyShot',
                                              application=self.chat_app)
        self.group.members.add(self.user)
        self.group.save()

        self.hashtag = Hashtag.objects.create(content="@test")

        message_content = "LaFayette @test"
        message_id = 1800

        self.message = models.store_message(self.chat_app,
                                            self.group.id,
                                            self.group.name,
                                            message_id,
                                            message_content,
                                            self.user.id,
                                            self.user.name,
                                            datetime.now())
        self.discussion = Discussion.objects.create(first_message=self.message, hashtag=self.hashtag)
        self.message.discussions.add(self.discussion)


class DiscussionMessageViewTest(ApiTestCase):
    def test(self, message_factory):
        url = reverse('discussion_messages')
        request_data = {
            'user_id': self.user.id,
            'discussion_id': message_factory.discussions.first().id,
            'page_num': 1
        }
        response = self.client.post(url,
                                    data=request_data,
                                    format='json')
        self.assertEquals(response.status_code, 200)

        expected = [{
            'id': message_factory.id,
            'app_message_id': message_factory.app_message_id,
            'sent_date': message_factory.sent_date.isoformat() + 'Z',
            'last_updated': message_factory.last_updated.isoformat() + 'Z',
            'content': message_factory.content,
            'sender_id': message_factory.sent_by.id,
            'sender_name': message_factory.sent_by.name,
            'discussions': [
                {
                    'id': self.discussion.id,
                    'hashtag': self.discussion.hashtag.content
                }
            ],
            'reply_to_id': None,
            # 'hashtags': [hashtag.content for hashtag in self.message.hashtags.all()],
        }]
        response_content = response.json()

        self.assertEquals(len(response_content), 1)
        self.assertDictEqual(response_content[0], expected[0])


# class ConversationStatsViewTest(ApiTestCase):
#
#     def test(self):
#         client = RequestsClient()
#         response = client.get('http://testserver/users/')
#         self.assertEquals(response.status_code, 200)


class DiscussionSummaryViewTest(ApiTestCase):
    def test(self):
        url = reverse('discussion_summary')
        request_data = {
            'user_id': self.user.id,
            'filters': {},
            'page_num': 1,
            'page_size': 100
        }
        response = self.client.post(url,
                                    data=request_data,
                                    format='json')
        self.assertEquals(response.status_code, 200)

        expected_message_details = {
            'id': self.message.id,
            'app_message_id': self.message.app_message_id,
            'sent_date': self.message.sent_date.isoformat() + 'Z',
            'last_updated': self.message.last_updated.isoformat() + 'Z',
            'content': self.message.content,
            'sender_id': self.message.sent_by.id,
            'sender_name': self.message.sent_by.name,
            'discussions': [{'id': discussion.id,
                             'hashtag': discussion.hashtag.content} for discussion in self.message.discussions.all()],
            'reply_to_id': self.message.reply_to_id,
        }
        expected = [{
            'discussion_id': self.discussion.id,
            'discussion_name': self.discussion.hashtag.content,
            'group_id': self.message.chat_group_id,
            'message_count': self.discussion.messages.count(),
            'last_updated': self.message.last_updated.isoformat() + 'Z',
            'first_message': expected_message_details,
            'latest_messages': [expected_message_details]
        }]
        response_content = response.json()

        self.assertEquals(len(response_content), 1)
        self.assertDictEqual(response_content[0], expected[0])


class GroupStatsViewTest(ApiTestCase):

    def test(self):
        # parameters - user, group, last_updated, app_name
        message_content = "LaFayette"
        message_id = 1800

        new_message = models.store_message(self.chat_app,
                                           self.group.id,
                                           self.group.name,
                                           message_id,
                                           message_content,
                                           self.user.id,
                                           self.user.name,
                                           datetime.now(pytz.utc))

        url = reverse('app_group_stats')
        response = self.client.post(url,
                                    data={'user_id': self.user.id})
        self.assertEquals(response.status_code, 200)
        expected = {
            'app_id': self.chat_app.id,
            'app_name': self.chat_app.name,
            'groups': [
                {
                    'id': self.group.id,
                    'name': self.group.name,
                    'last_updated': new_message.last_updated.isoformat(),
                }
            ]
        }
        response_content = response.json()

        self.assertEquals(len(response_content), 1)
        self.assertEquals(len(response_content[0]['groups']), 1)
        self.assertDictEqual(response_content[0], expected)

    '''test cases -
    - a user, has 1 group, all data is valid
    - a user with no groups
    - group without any messages
    - user id received is invalid / None / does not match any id in the DB
    - a user, one of the outputs is invalid (test for different arguments / outputs)
    - a user with multiple groups - validate that the returned value is valid
    - a member has access to data only for groups he is a member of
    - same ChatGroup ID for 2 groups in 2 different apps - check that our product differentiates them 
    '''

    # request_data = {
    #     'user_id': self.user.id,
    #     'filters': {
    #         'group_ids': None,
    #         'conversation_ids': None,
    #         'sender_ids': None,
    #         'min_date': None,
    #         'max_date': None,
    #         'freetext_search': "",
    #     },
