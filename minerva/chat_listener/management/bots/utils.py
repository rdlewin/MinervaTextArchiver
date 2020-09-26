import logging


def log_message(message, sender_id, sender_name, app_name):
    log = 'User #{user_id} ({user_name}) on app {app} sent the message "{message}"'.format(
        user_id=sender_id,
        user_name=sender_name,
        message=message,
        app=app_name
    )
    logging.info(log)


def running_bot_with_token_log(self, app_name):
    logging.info('%s bot started running. Token is: %s' % (app_name, self.token))
