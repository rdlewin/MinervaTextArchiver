from rest_framework import serializers


class DiscussionStatsRequestSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=False)
    group_ids = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)


class DiscussionStatsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    hashtag = serializers.CharField()
    group_id = serializers.IntegerField()
    group_name = serializers.CharField()
    message_count = serializers.IntegerField()
    last_updated = serializers.DateTimeField()


class GroupStatsRequestSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=False)


class GroupStatsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    last_updated = serializers.DateTimeField()
    app_name = serializers.CharField()
