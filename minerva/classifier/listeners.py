from django.dispatch import receiver

from minerva.core.signals import message_stored
from . import heuristics


@receiver(message_stored)
def classify_message(sender, **kwargs):
    message = kwargs.get('message')
    message.prefetch_related('chat_group')

    for classifier in heuristics.CLASSIFIERS:
        for classification in classifier.classify(message):
            if classification.is_new:
                classification.discussion.save()

            message.discussions.add(classification.discussion)
            classification.discussion.append(message)
