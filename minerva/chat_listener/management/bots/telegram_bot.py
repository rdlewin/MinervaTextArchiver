import logging

from telegram.ext import CommandHandler, Updater, MessageHandler, Filters
from telegram.user import User as TelegramUser

from minerva.chat_listener.management.bots.utils import log_message, running_bot_with_token_log, get_welcome_message
from minerva.classifier.listeners import classify_message
from minerva.core.models import ChatApp, User as MinervaUser
from minerva.core.utils import store_message, add_user

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
        self.chat_app, _ = ChatApp.objects.get_or_create(name='Telegram')

    def run_bot(self):
        logging.info('Starting up Telegram bot')

        updater = Updater(token=self.token, use_context=True)
        dispatcher = updater.dispatcher

        start_handler = CommandHandler('start', self.start)
        dispatcher.add_handler(start_handler)

        message_handler = MessageHandler(Filters.text & (~Filters.command), self.on_message)
        dispatcher.add_handler(message_handler)

        running_bot_with_token_log(self, type(self).__name__)
        updater.start_polling()

    def start(self, update, context):
        context.bot.send_message(chat_id=update.effective_chat.id, text="I'm a bot, please talk to me!")

    def on_message(self, update, context):
        app_message = update.message
        sender_id = app_message.from_user.id
        sender_name = app_message.from_user.full_name

        log_message(app_message.text, sender_id, sender_name, self.chat_app.name)

        reply_message_id = None
        if app_message.reply_to_message:
            reply_message_id = app_message.reply_to_message.message_id

        new_message = store_message(
            chat_app=self.chat_app,
            chat_group_id=app_message.chat.id,
            chat_group_name=app_message.chat.title,
            message_id=app_message.message_id,
            message_content=app_message.text,
            sender_id=app_message.from_user.id,
            sender_name=app_message.from_user.name,
            message_date=app_message.date,
            sender_obj=app_message.from_user,
            new_user_callback=self.send_welcome_message,
            reply_message_id=reply_message_id,
            edit_date=app_message.date
        )

        for user in app_message.new_chat_members:
            add_user(
                chat_app=self.chat_app,
                chat_group_id=app_message.chat.id,
                user_app_id=user.id,
                user_name=user.name
            )

        if new_message:
            classify_message(new_message)

    async def send_welcome_message(self, app_user: TelegramUser, minerva_user: MinervaUser):
        content = get_welcome_message(minerva_user, self.chat_app.id, app_user.id)
        app_user.send_message(content)
