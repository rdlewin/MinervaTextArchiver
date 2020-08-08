from django.http import JsonResponse
from django.views import View
from rest_framework import status

from minerva.core.models import Conversation, Message, ChatGroup
from minerva.webapp.serializers import ConversationStatsRequestSerializer, ConversationStatsSerializer, \
    GroupStatsRequestSerializer, GroupStatsSerializer


# TODO: implement filtering by group ID
class ConversationStatsView(View):
    def post(self, request):
        request_serializer = ConversationStatsRequestSerializer(data=request.POST)
        if not request_serializer.is_valid():
            return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_id = request_serializer.data.get('user_id')

        conversations = Conversation.objects.filter(messages__chat_group__members__id=user_id)

        response = []
        for conversation in conversations:
            conversation_chat_group = conversation.first_message.chat_group
            conversation_messages = Message.objects.filter(conversation=conversation)
            message_count = conversation_messages.count()
            last_conversation_message = conversation_messages.order_by('-last_updated').first()

            response.append(
                ConversationStatsSerializer({
                    "id": conversation.id,
                    "hashtag": conversation.hashtag,
                    "group_id": conversation_chat_group.id,
                    "group_name": conversation_chat_group.name,
                    "message_count": message_count,
                    "last_updated": last_conversation_message.last_updated
                })
            )

        return JsonResponse([r.data for r in response], status=status.HTTP_200_OK)


class GroupStatsView(View):
    def post(self, request):
        request_serializer = GroupStatsRequestSerializer(data=request.POST)
        if not request_serializer.is_valid():
            return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_id = request_serializer.data.get('user_id')

        groups = ChatGroup.objects.filter(members__id=user_id)

        response = []
        for group in groups:
            group_messages = Message.objects.filter(chat_group=group)
            last_group_message = group_messages.order_by('-last_updated').first()
            last_updated = last_group_message.last_updated

            response.append(
                GroupStatsSerializer({
                    "id": group.id,
                    "name": group.name,
                    "last_updated": last_updated,
                    "app_name": group.application.name
                })
            )

        return JsonResponse([r.data for r in response], status=status.HTTP_200_OK, safe=False)
