from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from rest_framework import status

from minerva.core.models import Conversation, Message
from minerva.webapp.serializers import ConversationListRequestSerializer, ConversationStatsSerializer


class ConversationListView(View):
    def post(self, request):
        request_serializer = ConversationListRequestSerializer(data=request.POST)
        if not request_serializer.is_valid():
            return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_id = request_serializer.data.get('user_id')

        conversations = Conversation.objects.filter(messages__chat_group__members__id=user_id)
        response = []
        
        for conversation in conversations:
            conversation_chat_group = conversation.first_message.chat_group
            conversation_messages = Message.objects.filter(conversation=conversation)
            message_count = conversation_messages.count()
            last_conversation_message = conversation.order_by('-last_updated').first()
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

        response = ConversationStatsSerializer().data

        return JsonResponse(response, status=status.HTTP_200_OK)
