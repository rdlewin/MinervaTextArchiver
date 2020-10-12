import logging

from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse, HttpResponse
from django.utils.http import urlsafe_base64_decode
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from minerva.core.models import Discussion, Message, User, AppUser, ChatGroup
from minerva.webapp.serializers import (
    AppGroupsSerializer,
    DiscussionMessageRequestSerializer,
    DiscussionStatsRequestSerializer,
    DiscussionStatsSerializer,
    DiscussionSummaryListSerializer,
    DiscussionSummaryRequestSerializer,
    DiscussionSummarySerializer,
    GroupStatsSerializer,
    MessageSerializer,
    UserDetailsSerializer,
    UserHashtagsSerializer,
    UserRegisterRequestSerializer,
)


def non_valid_request_serializer(self, request_serializer):
    logging.info('%s - request_serializer is not valid. Errors - %s' % (type(self).__name__,
                                                                        request_serializer.errors))
    return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DiscussionMessagesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request_serializer = DiscussionMessageRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return non_valid_request_serializer(self, request_serializer)
        discussion_id = request_serializer.data.get('discussion_id')
        user_groups = ChatGroup.objects.filter(members__id=request.user.id)

        messages = Message.objects.filter(chat_group__in=user_groups)
        messages = messages.filter(discussions__id=discussion_id)

        responses = (MessageSerializer.from_message(message) for message in messages)

        return JsonResponse([r.data for r in responses], status=status.HTTP_200_OK, safe=False)


class DiscussionSummaryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    LATEST_MESSAGE_AMOUNT = 3

    def post(self, request):
        request_serializer = DiscussionSummaryRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return non_valid_request_serializer(self, request_serializer)

        filters = request_serializer.data.get('filters', {})
        page_num = request_serializer.data.get('page_num')
        page_size = request_serializer.data.get('page_size')

        discussions = Discussion.objects.filter(messages__chat_group__members__id=request.user.id).order_by(
            'first_message_id')
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
        if filters.get('hashtags'):
            discussions = discussions.filter(hashtag__content__in=filters.get('hashtags'))
        # if filters.get('freetext_search'):
        #     discussions = discussions.filter(messages__chat_group_id__in=filters.get('freetext_search'))
        discussions = discussions.distinct()

        paginator = Paginator(discussions, page_size)
        try:
            current_page = paginator.page(page_num)
        except PageNotAnInteger:
            current_page = paginator.page(1)
        except EmptyPage:
            current_page = paginator.page(paginator.num_pages)

        discussion_summaries = []
        for discussion in current_page:
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

            discussion_summaries.append(
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

        response = DiscussionSummaryListSerializer({
            'discussions': [r.data for r in discussion_summaries],
            'current_page': page_num,
            'total_pages': paginator.num_pages,
        })

        return JsonResponse(response.data, status=status.HTTP_200_OK, safe=False)


class DiscussionStatsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request_serializer = DiscussionStatsRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return non_valid_request_serializer(self, request_serializer)

        discussions = Discussion.objects.filter(messages__chat_group__members__id=request.user.id)

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
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        groups = ChatGroup.objects.filter(members__id=request.user.id)

        app_groups = {}
        for group in groups:
            group_messages = Message.objects.filter(chat_group=group)
            last_group_message = group_messages.order_by('-last_updated').first()
            last_updated = None
            if last_group_message:
                last_updated = last_group_message.last_updated.isoformat()
            discussions_count = Discussion.objects.filter(first_message__chat_group=group).count()

            group_stats = GroupStatsSerializer({
                'id': group.id,
                'name': group.name,
                'last_updated': last_updated,
                'discussions_count': discussions_count
            })
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
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        hashtags = Message.objects.filter(chat_group__members__id=request.user.id).exclude(
            hashtags__isnull=True).values_list(
            'hashtags__content', flat=True)

        response = UserHashtagsSerializer({'hashtags': hashtags})

        return JsonResponse(response.data, status=status.HTTP_200_OK, safe=False)


class UserRegisterView(APIView):
    def post(self, request, user_uid, token):
        user = _get_user(user_uid)
        if not user:
            logging.info('user ID %s is not valid or does not exist' % user_uid)
            return JsonResponse({'error': 'Invalid User UID %s' % user_uid},
                                status=status.HTTP_400_BAD_REQUEST)
        if not _check_token(user, token):
            logging.info('user Token %s is not valid' % token)
            return JsonResponse({'error': 'Invalid Token %s' % token},
                                status=status.HTTP_400_BAD_REQUEST)

        request_serializer = UserRegisterRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return non_valid_request_serializer(self, request_serializer)

        username = request_serializer.data.get('username')
        password = request_serializer.data.get('password')
        email = request_serializer.data.get('email')
        phone = request_serializer.data.get('phone')

        if user.username != username:
            user.username = username
        user.set_password(password)
        if email:
            user.email = email
        if phone:
            user.phone_number = phone
        user.save()

        return HttpResponse(status=status.HTTP_201_CREATED)

    def get(self, request, user_uid, token):
        user = _get_user(user_uid)
        if not user:
            logging.info('user ID %s is not valid or does not exist' % user_uid)
            return JsonResponse({'error': 'Invalid User UID %s' % user_uid},
                                status=status.HTTP_400_BAD_REQUEST)
        if not _check_token(user, token):
            logging.info('user Token %s is not valid' % token)
            return JsonResponse({'error': 'Invalid Token %s' % token},
                                status=status.HTTP_400_BAD_REQUEST)

        response = {
            'username': user.username,
            'id': user.id
        }
        return JsonResponse(response, status=status.HTTP_200_OK)


class UserDetailsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return JsonResponse(UserDetailsSerializer(request.user).data, status=status.HTTP_200_OK)


class UserAddAppView(APIView):
    def post(self, request, user_uid, token, app_id, user_app_uid):
        user = _get_user(user_uid)
        if not user:
            logging.info('user ID %s is not valid or does not exist' % user_uid)
            return JsonResponse({'error': 'Invalid User UID %s' % user_uid},
                                status=status.HTTP_400_BAD_REQUEST)
        if not _check_token(user, token):
            logging.info('user Token %s is not valid' % token)
            return JsonResponse({'error': 'Invalid Token %s' % token},
                                status=status.HTTP_400_BAD_REQUEST)

        try:
            user_app_id = urlsafe_base64_decode(user_app_uid).decode()
        except (TypeError, ValueError, OverflowError):
            return JsonResponse({'error': 'Invalid User App ID %s' % user_app_uid},
                                status=status.HTTP_400_BAD_REQUEST)

        AppUser.objects.create(app_id=app_id,
                               user_id=user.id,
                               user_app_id=user_app_id)
        return HttpResponse(status=status.HTTP_201_CREATED)


def _check_token(user, token):
    return default_token_generator.check_token(user, token)


def _get_user(user_uid):
    try:
        # urlsafe_base64_decode() decodes to bytestring
        uid = urlsafe_base64_decode(user_uid).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist, ValidationError):
        user = None
    return user
