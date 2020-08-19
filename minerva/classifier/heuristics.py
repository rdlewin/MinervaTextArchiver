from abc import ABC
from collections import namedtuple
from typing import List

from minerva.core.models import Discussion, Message

ClassificationResult = namedtuple('ClassificationResult', ['discussion', 'confidence', 'is_new'])


class AbstractClassifier(ABC):
    def classify(self, message: Message) -> List[ClassificationResult]:
        """
        return:
            Discussion instance - nullable if none found
            Confidence level - default value is 1. Confidence level of the returned classification
        """
        raise NotImplemented


class HashtagClassifier(AbstractClassifier):
    def classify(self, message):
        message_hashtags = message.hashtags.all().values_list("content", flat=True)
        related_discussions = Discussion.objects.filter(first_message__chat_group=message.chat_group,
                                                        hashtag__content__in=message_hashtags)
        related_discussions = related_discussions.select_related("hashtag__content")

        existing_hashtags = related_discussions.values_list("hashtag__content", flat=True)

        classified_discussions = []

        for hashtag in message_hashtags:
            if hashtag in existing_hashtags:
                # TODO: populate "hashtag.discussion" with the correct path
                classified_discussions.append(ClassificationResult("hashtag.discussion", 1, False))
            else:
                classified_discussions.append(ClassificationResult(Discussion(message, hashtag), 1, True))

        return classified_discussions
