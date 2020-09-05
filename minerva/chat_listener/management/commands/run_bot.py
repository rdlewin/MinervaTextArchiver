from django.conf import settings
from django.core.management.base import BaseCommand

from minerva.chat_listener.management.bots.discord_bot import DiscordBot
from minerva.chat_listener.management.bots.telegram_bot import TelegramBot

CHAT_BOTS = {
    'Telegram': (TelegramBot, settings.TELEGRAM_BOT_TOKEN),
    'Discord': (DiscordBot, settings.DISCORD_BOT_TOKEN),
}


class Command(BaseCommand):
    help = 'Run specified chat bot'

    def add_arguments(self, parser):
        parser.add_argument('app', type=str, nargs='?', default='Telegram')

    def handle(self, *args, **options):
        app = options['app']
        bot_type, token = CHAT_BOTS[app]
        bot_type(token).run_bot()
