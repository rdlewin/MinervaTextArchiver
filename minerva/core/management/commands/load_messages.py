import json

from django.core.management.base import BaseCommand

from minerva.core.models import ChatApp, User, AppUser, Hashtag, Discussion, Message, ChatGroup


class Command(BaseCommand):
    help = 'Load messages from JSON to the DB - used for setting up test env'

    def add_arguments(self, parser):
        parser.add_argument('paths', type=str, nargs='+', help='Path to json file including message details')

    def handle(self, *args, **options):
        paths = options['paths']
        for path in paths:
            with open(path, 'r') as f:
                data = json.load(f)

                for chat_group_details in data.get('chat_groups'):
                    chat_app, app_created = ChatApp.objects.get_or_create(name=chat_group_details.get('application'))
                    chat_group = self._create_chat_group(chat_app, chat_group_details)

                    members = self._create_members(chat_app, chat_group_details)
                    chat_group.members.add(*members)

                    hashtags = self._create_hashtags(chat_group_details)

                    messages = self._create_messages(chat_app, chat_group, chat_group_details, hashtags)

                    chat_group.hashtags.add(*hashtags)
                    chat_group.message_set.add(*messages)

    def _create_chat_group(self, chat_app, chat_group_details):
        chat_group_id = chat_group_details.get('app_chat_id')
        chat_group, group_created = ChatGroup.objects.get_or_create(application=chat_app,
                                                                    app_chat_id=chat_group_id)
        chat_group_name = chat_group_details.get('name')
        if chat_group.name != chat_group_name:
            chat_group.name = chat_group_name
            chat_group.save()

        return chat_group

    def _create_members(self, chat_app, chat_group_details):
        members = []
        for member in chat_group_details.get('members'):
            user_name = member.get('name')
            user_phone = member.get('phone')
            user_email = member.get('email')
            user, _ = User.objects.get_or_create(username=user_name,
                                                 phone_number=user_phone,
                                                 email=user_email)

            user_app_id = member.get('app_user_id')

            app_user = AppUser.objects.create(user=user,
                                              app=chat_app,
                                              user_app_id=user_app_id)

            members.append(user)
        return members

    def _create_hashtags(self, chat_group_details):
        hashtags = set()
        for current_hashtag in chat_group_details.get('hashtags'):
            hashtag, _ = Hashtag.objects.get_or_create(content=current_hashtag)
            hashtags.add(hashtag)
        return hashtags

    def _create_messages(self, chat_app, chat_group, chat_group_details, hashtags):
        messages = []
        for message_details in chat_group_details.get('messages'):
            app_message_id = message_details.get('app_message_id')
            sent_date = message_details.get('sent_date')
            last_updated = message_details.get('last_updated')
            sender_user_app_id = message_details.get('sent_by_id')
            reply_to_id = message_details.get('reply_to_id')
            content = message_details.get('content')
            sent_by = AppUser.objects.filter(app=chat_app,
                                             user_app_id=sender_user_app_id).first().user
            reply_to = None
            if reply_to_id:
                reply_to = Message.objects.filter(app_message_id=app_message_id,
                                                  chat_group__application=chat_app).first()

            message = Message.objects.create(app_message_id=app_message_id,
                                             chat_group=chat_group,
                                             sent_date=sent_date,
                                             last_updated=last_updated,
                                             sent_by=sent_by,
                                             reply_to=reply_to,
                                             content=content)

            discussion_ids = message_details.get('discussion_ids')

            message_hashtags = message_details.get('hashtags')
            discussions = []
            for hashtag_content in message_hashtags:
                hashtag, _ = Hashtag.objects.get_or_create(content=hashtag_content)
                hashtags.add(hashtag)

                current_discussion = Discussion.objects.filter(first_message__chat_group=chat_group,
                                                               hashtag=hashtag).first()
                if current_discussion:
                    current_discussion.first_message = message
                else:
                    current_discussion = Discussion.objects.create(first_message=message,
                                                                   hashtag=hashtag)

                    try:
                        discussion_ids.remove(current_discussion.id)
                    except ValueError:
                        pass

                    if current_discussion.first_message.id != message.id and current_discussion.first_message.sent_date > message.sent_date:
                        current_discussion.first_message = message
                current_discussion.save()
                discussions.append(current_discussion)

            for discussion_id in discussion_ids:
                discussion = Discussion.objects.filter(id=discussion_id).first()
                if not discussion:
                    discussion = Discussion.objects.create(first_message=message)
                discussions.append(discussion)

            message.discussions.add(*discussions)
            messages.append(message)

        return messages
