import logging
from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


def log_message(message, sender_id, sender_name, app_name):
    log = 'User #{user_id} ({user_name}) on app {app} sent the message "{message}"'.format(
        user_id=sender_id,
        user_name=sender_name,
        message=message,
        app=app_name
    )
    logging.info(log)


WELCOME_MESSAGE_TEMPLATE = '''
Hi, thanks for using Minerva Chat Archiver! \n
To access your chat history, please register using the following link: {register_url} \n
If you already have a Minerva account from another chat application, please link this application too, using this link: {add_app_user_url}
'''


def get_welcome_message(user: AbstractUser, app_id, app_user_id: int):
    domain = settings.SITE_URL
    user_uid = urlsafe_base64_encode(force_bytes(user.pk))
    app_user_uid = urlsafe_base64_encode(force_bytes(app_user_id))
    token = default_token_generator.make_token(user)

    register_url = urljoin(domain, '/'.join(['register', user_uid, token]))
    add_app_user_url = urljoin(domain, '/'.join(['addApp', user_uid, token, str(app_id), app_user_uid]))

    return WELCOME_MESSAGE_TEMPLATE.format(register_url=register_url, add_app_user_url=add_app_user_url)


def running_bot_with_token_log(self, app_name):
    logging.info('%s bot started running. Token is: %s' % (app_name, self.token))
