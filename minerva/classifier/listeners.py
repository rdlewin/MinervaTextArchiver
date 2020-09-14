from django.dispatch import receiver

from minerva.core.signals import message_stored
from . import heuristics


@receiver(message_stored)
def classify_message(sender, **kwargs):
    message = kwargs.get('message')

    for classifier in heuristics.CLASSIFIERS:
        classifications = classifier.classify(message)
        for classification in classifications:
            if classification.is_new:
                classification.discussion.save()

            message.discussions.add(classification.discussion)
