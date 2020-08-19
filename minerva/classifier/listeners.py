from django.dispatch import receiver

from minerva.core.signals import message_stored
from . import heuristics


@receiver(message_stored)
def classify_message(sender, **kwargs):
    message = kwargs.get('message')
    message.prefetch_related('chat_group')
