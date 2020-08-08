import logging
from django.conf import settings
from telegram.ext import CommandHandler, Updater, MessageHandler, Filters

from minerva.core.models import ChatApp, store_message

"""
Telegram bot API documentation: https://core.telegram.org/bots
Python Telegram Bot Github: https://github.com/python-telegram-bot/python-telegram-bot
Tutorial used for this file: https://github.com/python-telegram-bot/python-telegram-bot/wiki/Extensions-%E2%80%93-Your-first-Bot

Telegram bot used to control other bots: @BotFather https://t.me/botfather

Test bot used here: @MtaArchiverTestBot http://t.me/MtaArchiverTestBot
"""

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)


class TelegramBot(object):
    def __init__(self, token):
        self.token = token
        self.chat_app, _ = ChatApp.objects.get_or_create(name='Telegram',
                                                         bot_token=settings.TELEGRAM_BOT_TOKEN)

    def run(self):
        logging.info('Starting up')

        updater = Updater(token=self.token, use_context=True)
        dispatcher = updater.dispatcher

        start_handler = CommandHandler('start', self.start)
        dispatcher.add_handler(start_handler)

        message_handler = MessageHandler(Filters.text & (~Filters.command), self.save_message)
        dispatcher.add_handler(message_handler)

        logging.info('Bot started')
        updater.start_polling()

    def start(self, update, context):
        context.bot.send_message(chat_id=update.effective_chat.id, text="I'm a bot, please talk to me!")

    def save_message(self, update, context):
        app_message = update.message
        log_message(app_message)

        reply_message_id = None
        if app_message.reply_to_message:
            reply_message_id = app_message.reply_to_message.message_id

        store_message(
            chat_app=self.chat_app,
            chat_group_id=app_message.chat.id,
            chat_group_name=app_message.chat.title,
            message_id=app_message.message_id,
            message_content=app_message.text,
            sender_id=app_message.from_user.id,
            sender_name=app_message.from_user.name,
            message_date=app_message.date,
            reply_message_id=reply_message_id,
            edit_date=app_message.date)


def log_message(message):
    log = 'User #{user_id} ({user_name}) sent the message "{message}"'.format(
        user_id=message.from_user.id,
        user_name=message.from_user.full_name,
        message=message.text
    )
    logging.info(log)
