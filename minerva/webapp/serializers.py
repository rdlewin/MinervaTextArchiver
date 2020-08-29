from rest_framework import serializers


class DiscussionMessageRequestSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)
    discussion_id = serializers.IntegerField(required=True)
    page_num = serializers.IntegerField(required=True)


class DiscussionIdSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    hashtag = serializers.CharField(source='hashtag.content')


class MessageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    app_message_id = serializers.IntegerField()
    sent_date = serializers.DateTimeField(format=None)
    last_updated = serializers.DateTimeField(format=None)
    content = serializers.CharField()
    sender_id = serializers.IntegerField(source='sent_by.id')
    sender_name = serializers.CharField(source='sent_by.name')
    discussions = DiscussionIdSerializer(many=True)
    reply_to_id = serializers.IntegerField()

    # hashtags = serializers.ListField(child=serializers.CharField())

    @classmethod
    def from_message(cls, message):
        discussion_ids = []
        discussion_hashtags = []
        reply_to_id = None
        for discussion in message.discussions.all():
            discussion_ids.append(discussion.id)
            discussion_hashtags.append(discussion.hashtag.content)
        if message.reply_to:
            reply_to_id = message.reply_to.id

        hashtags = [hashtag.content for hashtag in message.hashtags.all()]

        return cls({
            'id': message.id,
            'app_message_id': message.app_message_id,
            'sent_date': message.sent_date,
            'last_updated': message.last_updated,
            'content': message.content,
            'sender_id': message.sent_by.id,
            'sender_name': message.sent_by.name,
            'discussion_ids': discussion_ids,
            'discussion_hashtags': discussion_hashtags,
            'reply_to_id': reply_to_id,
            'hashtags': hashtags
        })


class DiscussionSummaryFilterSerializer(serializers.Serializer):
    group_ids = serializers.ListField(child=serializers.IntegerField(), required=False, allow_null=True,
                                      allow_empty=True)
    discussion_ids = serializers.ListField(child=serializers.IntegerField(), required=False, allow_null=True,
                                           allow_empty=True)
    sender_ids = serializers.ListField(child=serializers.IntegerField(), required=False, allow_null=True,
                                       allow_empty=True)
    min_date = serializers.DateTimeField(required=False, allow_null=True)
    max_date = serializers.DateTimeField(required=False, allow_null=True)
    freetext_search = serializers.CharField(required=False, allow_null=True, allow_blank=True)


class DiscussionSummaryRequestSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)
    filters = DiscussionSummaryFilterSerializer(required=False)
    page_num = serializers.IntegerField(required=True)


class DiscussionSummarySerializer(serializers.Serializer):
    discussion_id = serializers.IntegerField(required=True)
    hashtag = serializers.CharField(required=True)
    group_id = serializers.IntegerField(required=True)
    message_count = serializers.IntegerField(required=True)
    last_updated = serializers.DateTimeField(required=True)
    first_message = MessageSerializer()
    latest_messages = MessageSerializer(many=True)


class DiscussionStatsRequestSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)
    group_ids = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)


class DiscussionStatsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    hashtag = serializers.CharField()
    group_id = serializers.IntegerField()
    group_name = serializers.CharField()
    message_count = serializers.IntegerField()
    last_updated = serializers.DateTimeField()


class GroupStatsRequestSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)


class GroupStatsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    last_updated = serializers.DateTimeField()


class AppGroupsSerializer(serializers.Serializer):
    app_id = serializers.IntegerField()
    app_name = serializers.CharField()
    groups = GroupStatsSerializer(many=True)
