from rest_framework import serializers


class ConversationListRequestSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=False)
    group_ids = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)


class ConversationStatsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    hashtag = serializers.CharField()
    group_id = serializers.IntegerField()
    group_name = serializers.CharField()
    message_count = serializers.IntegerField()
    last_updated = serializers.DateTimeField()
