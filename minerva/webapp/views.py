from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView

from minerva.core.models import Discussion, Message, ChatGroup
from minerva.webapp.serializers import DiscussionStatsRequestSerializer, DiscussionStatsSerializer, \
    GroupStatsRequestSerializer, GroupStatsSerializer, MessageSerializer, DiscussionSummaryRequestSerializer, \
    DiscussionMessageRequestSerializer, DiscussionSummarySerializer, AppGroupsSerializer, UserHashtagsRequestSerializer, \
    UserHashtagsSerializer


class DiscussionMessagesView(APIView):
    def post(self, request):
        request_serializer = DiscussionMessageRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_id = request_serializer.data.get('user_id')
        discussion_id = request_serializer.data.get('discussion_id')
        user_groups = ChatGroup.objects.filter(members__id=user_id)

        messages = Message.objects.filter(chat_group__in=user_groups)
        messages = messages.filter(discussions__id=discussion_id)

        responses = (MessageSerializer.from_message(message) for message in messages)

        return JsonResponse([r.data for r in responses], status=status.HTTP_200_OK, safe=False)


# TODO: implement filters and pagination
class DiscussionSummaryView(APIView):
    LATEST_MESSAGE_AMOUNT = 3

    def post(self, request):
        request_serializer = DiscussionSummaryRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_id = request_serializer.data.get('user_id')
        filters = request_serializer.data.get('filters')
        page_num = request_serializer.data.get('page_num')

        discussions = Discussion.objects.filter(messages__chat_group__members__id=user_id)
        if filters.get('group_ids'):
            discussions = discussions.filter(messages__chat_group_id__in=filters.get('group_ids'))
        if filters.get('app_name'):
            discussions = discussions.filter(first_message__chat_group__application__name=filters.get('app_name'))
        if filters.get('discussion_ids'):
            discussions = discussions.filter(id__in=filters.get('discussion_ids'))
        if filters.get('sender_ids'):
            discussions = discussions.filter(messages__sent_by_id__in=filters.get('sender_ids'))
        if filters.get('min_date'):
            discussions = discussions.filter(first_message__sent_date__gte=filters.get('min_date'))
        if filters.get('max_date'):
            discussions = discussions.filter(messages__last_updated__lte=filters.get('max_date'))
        # if filters.get('freetext_search'):
        #     discussions = discussions.filter(messages__chat_group_id__in=filters.get('freetext_search'))

        response = []
        for discussion in discussions:
            discussion_chat_group = discussion.first_message.chat_group
            discussion_messages = Message.objects.filter(discussions__id=discussion.id)
            message_count = discussion_messages.count()
            latest_discussion_messages = discussion_messages.order_by('-last_updated')
            last_discussion_message = latest_discussion_messages.first()
            latest_discussion_messages = latest_discussion_messages[:self.LATEST_MESSAGE_AMOUNT]
            last_updated = None
            if last_discussion_message:
                last_updated = last_discussion_message.last_updated

            discussion_name = None
            if discussion.hashtag:
                discussion_name = discussion.hashtag.content

            response.append(
                DiscussionSummarySerializer({
                    "discussion_id": discussion.id,
                    "discussion_name": discussion_name,
                    "group_id": discussion_chat_group.id,
                    "group_name": discussion_chat_group.name,
                    "message_count": message_count,
                    "last_updated": last_updated,
                    "first_message": MessageSerializer.from_message(discussion.first_message).data,
                    "latest_messages": (MessageSerializer.from_message(message).data for message in
                                        latest_discussion_messages)
                })
            )

        return JsonResponse([r.data for r in response], status=status.HTTP_200_OK, safe=False)


class DiscussionStatsView(APIView):
    def post(self, request):
        request_serializer = DiscussionStatsRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_id = request_serializer.data.get('user_id')

        discussions = Discussion.objects.filter(messages__chat_group__members__id=user_id)

        response = []
        for discussion in discussions:
            discussion_chat_group = discussion.first_message.chat_group
            discussion_messages = Message.objects.filter(discussions__exact=discussion)
            message_count = discussion_messages.count()
            last_discussion_message = discussion_messages.order_by('-last_updated').first()
            last_updated = None
            if last_discussion_message:
                last_updated = last_discussion_message.last_updated.isoformat()

            response.append(
                DiscussionStatsSerializer({
                    "id": discussion.id,
                    "hashtag": discussion.hashtag,
                    "group_id": discussion_chat_group.id,
                    "group_name": discussion_chat_group.name,
                    "message_count": message_count,
                    "last_updated": last_updated
                })
            )

        return JsonResponse([r.data for r in response], status=status.HTTP_200_OK, safe=False)


class AppGroupStatsView(APIView):
    def post(self, request):
        request_serializer = GroupStatsRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_id = request_serializer.data.get('user_id')

        groups = ChatGroup.objects.filter(members__id=user_id)

        app_groups = {}
        for group in groups:
            group_messages = Message.objects.filter(chat_group=group)
            last_group_message = group_messages.order_by('-last_updated').first()
            last_updated = None
            if last_group_message:
                last_updated = last_group_message.last_updated.isoformat()

            group_stats = GroupStatsSerializer({'id': group.id,
                                                'name': group.name,
                                                'last_updated': last_updated})
            if group.application not in app_groups:
                app_groups[group.application] = [group_stats]
            else:
                app_groups[group.application].append(group_stats)

        response = []
        for app, groups in app_groups.items():
            response.append(AppGroupsSerializer({
                'app_id': app.id,
                'app_name': app.name,
                'groups': [group.data for group in groups]
            }))

        return JsonResponse([r.data for r in response], status=status.HTTP_200_OK, safe=False)


class UserHashtagsView(APIView):
    def post(self, request):
        request_serializer = UserHashtagsRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_id = request_serializer.data.get('user_id')

        hashtags = Message.objects.filter(chat_group__members__id=user_id).exclude(hashtags__isnull=True).values_list(
            'hashtags__content', flat=True)

        response = UserHashtagsSerializer({'hashtags': hashtags})

        return JsonResponse(response.data, status=status.HTTP_200_OK, safe=False)
