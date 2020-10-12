import asyncio
from datetime import datetime

import pytz
from django.test import TestCase
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APIRequestFactory
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken

from minerva.core import utils
from minerva.core.models import User, ChatGroup, ChatApp, Discussion, Hashtag, AppUser


class ApiTestCase(TestCase):
    def setUp(self):
        self.backend = JWTAuthentication()

        self.maxDiff = None
        self.client = APIClient()

        self.chat_app = ChatApp.objects.create(name="Telegram")

        self.user = User.objects.create(username='Alexander Hamilton')
        self.user_password = 'TestPass!123'
        self.user.set_password(self.user_password)
        self.app_user = AppUser.objects.create(user=self.user, app=self.chat_app, user_app_id='123456')
        self.group = ChatGroup.objects.create(app_chat_id=self.chat_app.id,
                                              name='MyShot',
                                              application=self.chat_app)
        self.group.members.add(self.user)
        self.group.save()

        self.hashtag = Hashtag.objects.create(content="test")

        message_content = "LaFayette #test"
        message_id = 1800

        self.message = utils.store_message(self.chat_app,
                                           self.group.id,
                                           self.group.name,
                                           message_id,
                                           message_content,
                                           self.app_user.user_app_id,
                                           self.user.username,
                                           datetime.now(),
                                           self.user)
        self.discussion = Discussion.objects.create(first_message=self.message, hashtag=self.hashtag)
        self.message.discussions.add(self.discussion)

    def _login(self, user=None):
        if not user:
            user = self.user
        token = AccessToken.for_user(user)
        return str(token)


class DiscussionMessageViewTest(ApiTestCase):
    def test(self):
        jwt = self._login()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {jwt}')

        url = reverse('discussion_messages')
        request_data = {
            'user_id': self.user.id,
            'discussion_id': self.message.discussions.first().id,
            'page_num': 1
        }
        response = self.client.post(url,
                                    data=request_data,
                                    format='json')
        self.assertEquals(response.status_code, 200)

        expected = [{
            'id': self.message.id,
            'app_message_id': self.message.app_message_id,
            'sent_date': self.message.sent_date.isoformat() + 'Z',
            'last_updated': self.message.last_updated.isoformat() + 'Z',
            'content': self.message.content,
            'sender_id': self.message.sent_by.id,
            'sender_name': self.message.sent_by.username,
            'discussions': [
                {
                    'id': self.discussion.id,
                    'hashtag': self.discussion.hashtag.content
                }
            ],
            'reply_to_id': None,
        }]
        response_content = response.json()

        self.assertEquals(len(response_content), 1)
        self.assertDictEqual(response_content[0], expected[0])


class DiscussionSummaryViewTest(ApiTestCase):
    def test(self):
        jwt = self._login()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {jwt}')

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
            'sender_name': self.message.sent_by.username,
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

        self.assertEquals(set(response_content.keys()),
                          {'discussions', 'current_page', 'total_pages'})
        self.assertEquals(len(response_content['discussions']), 1)
        self.assertDictEqual(response_content['discussions'][0], expected[0])


class GroupStatsViewTest(ApiTestCase):

    def test(self):
        jwt = self._login()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {jwt}')

        message_content = "LaFayette"
        message_id = 1800

        new_message = utils.store_message(self.chat_app,
                                          self.group.id,
                                          self.group.name,
                                          message_id,
                                          message_content,
                                          self.app_user.user_app_id,
                                          self.user.username,
                                          datetime.now(pytz.utc),
                                          self.user)

        url = reverse('app_group_stats')
        response = self.client.post(url,
                                    data={'user_id': self.user.id})
        self.assertEquals(response.status_code, 200)
        expected = {
            'app_id': self.chat_app.id,
            'app_name': self.chat_app.name,
            'groups': [
                {
                    'discussions_count': 1,
                    'id': self.group.id,
                    'name': self.group.name,
                    'last_updated': new_message.last_updated.isoformat(),
                }
            ]
        }
        response_content = response.json()

        self.assertEquals(len(response_content), 1)
        self.assertEquals(set(response_content[0].keys()),
                          {'app_id', 'app_name', 'groups'})
        self.assertDictEqual(response_content[0], expected)
