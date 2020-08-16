from datetime import datetime

import pytz
from django.test import TestCase
from rest_framework.reverse import reverse
from rest_framework.test import APIClient

from minerva.core import models
from minerva.core.models import User, ChatGroup, ChatApp


# class ConversationStatsViewTest(TestCase):
#
#     def test(self):
#         client = RequestsClient()
#         response = client.get('http://testserver/users/')
#         self.assertEquals(response.status_code, 200)


class GroupStatsViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.chat_app = ChatApp.objects.create(name="Telegram")

    def test(self):
        # parameters - user, group, last_updated, app_name
        user = User.objects.create(name='Alexander Hamilton')
        group = ChatGroup.objects.create(app_chat_id=1,
                                         name='MyShot',
                                         application=self.chat_app)
        group.members.add(user)
        group.save()

        message_content = "LaFayette"
        message_id = 1800

        new_message = models.store_message(self.chat_app,
                                           group.id,
                                           group.name,
                                           message_id,
                                           message_content,
                                           user.id,
                                           user.name,
                                           datetime.now(pytz.utc))

        url = reverse('group_stats')
        response = self.client.post(url,
                                    data={'user_id': user.id})
        self.assertEquals(response.status_code, 200)
        expected = {
            'id': group.id,
            'name': group.name,
            'last_updated': new_message.last_updated.isoformat().replace('+00:00', 'Z'),
            'app_name': self.chat_app.name
        }
        response_content = response.json()

        self.assertEquals(len(response_content), 1)
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
