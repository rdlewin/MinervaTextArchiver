import logging
from telegram.ext import CommandHandler, Updater, MessageHandler, Filters

from minerva.core.models import Message, ChatApp, ChatGroup, AppUsers, User

"""
Telegram bot API documentation: https://core.telegram.org/bots
Python Telegram Bot Github: https://github.com/python-telegram-bot/python-telegram-bot
Tutorial used for this file: https://github.com/python-telegram-bot/python-telegram-bot/wiki/Extensions-%E2%80%93-Your-first-Bot

Telegram bot used to control other bots: @BotFather https://t.me/botfather

Test bot used here: @MtaArchiverTestBot http://t.me/MtaArchiverTestBot
"""

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

TOKEN = '1091823005:AAGKv37qO50fTAQy79F-rmetz-KsHNvFStE'


class TelegramBot(object):
    def __init__(self, token):
        self.token = token
        self.chat_app, _ = ChatApp.objects.get_or_create(name='Telegram',
                                                         bot_token=TOKEN)

    def run(self):
        logging.info('Starting up')

        updater = Updater(token=self.token, use_context=True)
        dispatcher = updater.dispatcher

        start_handler = CommandHandler('start', self.start)
        dispatcher.add_handler(start_handler)

        message_handler = MessageHandler(Filters.text & (~Filters.command), self.store_message)
        dispatcher.add_handler(message_handler)

        logging.info('Bot started')
        updater.start_polling()

    def start(self, update, context):
        context.bot.send_message(chat_id=update.effective_chat.id, text="I'm a bot, please talk to me!")

    def store_message(self, update, context):
        app_message = update.message
        log_message(app_message)

        chat_group, group_created = ChatGroup.objects.get_or_create(application=self.chat_app,
                                                                    app_chat_id=app_message.chat.id)
        if group_created:
            chat_group.name = app_message.chat.title

        new_message = Message.objects.filter(app_message_id=app_message.message_id,
                                             chat_group=chat_group).first()

        if not new_message:
            app_sender = AppUsers.objects.filter(app=self.chat_app,
                                                 user_app_id=app_message.from_user.id).first()
            if not app_sender:
                new_user = User.objects.create(name=app_message.from_user.name)
                app_sender = AppUsers.objects.create(
                    user=new_user,
                    app=self.chat_app,
                    user_app_id=app_message.from_user.id
                )

            reply_to = None
            if app_message.reply_to_message:
                reply_to = Message.objects.filter(app_message_id=app_message.reply_to_message.message_id).first()

            new_message = Message(
                app_message_id=app_message.message_id,
                sent_date=app_message.date,
                last_updated=app_message.date,
                chat_group=chat_group,
                sent_by=app_sender.user,
                reply_to=reply_to,
                conversation=None
            )

        new_message.content = app_message.text

        if app_message.edit_date:
            new_message.last_updated = app_message.edit_date

        new_message.save()


def log_message(message):
    log = 'User #{user_id} ({user_name}) sent the message "{message}"'.format(
        user_id=message.from_user.id,
        user_name=message.from_user.full_name,
        message=message.text
    )
    logging.info(log)
