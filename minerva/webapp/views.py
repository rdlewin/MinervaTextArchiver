from django.http import JsonResponse
from django.views import View
from rest_framework import status

from minerva.core.models import Discussion, Message, ChatGroup
from minerva.webapp.serializers import DiscussionStatsRequestSerializer, DiscussionStatsSerializer, \
    GroupStatsRequestSerializer, GroupStatsSerializer


# TODO: implement filtering by group ID
class DiscussionStatsView(View):
    def post(self, request):
        request_serializer = DiscussionStatsRequestSerializer(data=request.POST)
        if not request_serializer.is_valid():
            return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_id = request_serializer.data.get('user_id')

        discussions = Discussion.objects.filter(messages__chat_group__members__id=user_id)

        response = []
        for discussion in discussions:
            discussion_chat_group = discussion.first_message.chat_group
            discussion_messages = Message.objects.filter(discussion=discussion)
            message_count = discussion_messages.count()
            last_discussion_message = discussion_messages.order_by('-last_updated').first()

            response.append(
                DiscussionStatsSerializer({
                    "id": discussion.id,
                    "hashtag": discussion.hashtag,
                    "group_id": discussion_chat_group.id,
                    "group_name": discussion_chat_group.name,
                    "message_count": message_count,
                    "last_updated": last_discussion_message.last_updated
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
