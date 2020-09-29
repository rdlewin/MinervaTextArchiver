import random
from datetime import datetime
from typing import Optional, List

import pytest

from minerva.core.models import ChatApp, ChatGroup, User, Message, AppUsers


@pytest.fixture()
def chat_app(app_name='Telegram'):
    return ChatApp.objects.create(name=app_name)


@pytest.fixture()
def chat_group_factory(chat_app: ChatApp):
    def create_chat_group(app_chat_id=123, name='test group') -> ChatGroup:
        return ChatGroup.objects.create(
            app_chat_id=app_chat_id,
            name=name,
            application=chat_app,
        )

    return create_chat_group


@pytest.fixture()
def chat_group(chat_group_factory):
    chat_group_factory(name='My Shot')


@pytest.fixture()
def user_factory(chat_app: ChatApp,
                 chat_group: ChatGroup):
    def create_user(
            user_app_id: Optional[str],
            name: Optional[str] = 'Alexander Hamilton',
            phone_number: Optional[str] = '+972501234568',
            email: Optional[str] = 'alexander@ny.gov',
    ) -> User:
        if not user_app_id:
            user_app_id = str(random.randint(0, 999999))
        user = User.objects.create(
            name=name,
            phone_number=phone_number,
            email=email,
        )
        user.chat_groups.add(chat_group)
        AppUsers.objects.create(user=user, app=chat_app, user_app_id=user_app_id)

        return user

    return create_user


@pytest.fixture
def message_factory(chat_group: ChatGroup = chat_group_factory):
    def create_message(
            app_message_id: Optional[str],
            message_content: Optional[User] = "Hello world",
            sender: Optional[User] = None,
            message_date: Optional[datetime] = None,
            reply_message_id: Optional[int] = None,
            edit_date: Optional[datetime] = None
    ) -> Message:
        if not app_message_id:
            app_message_id = str(random.randint(0, 999999))
        if not message_date:
            message_date = datetime.utcnow()
        if not edit_date:
            edit_date = datetime.utcnow()

        message = Message.objects.create(
            chat_group=chat_group,
            app_message_id=app_message_id,
            content=message_content,
            sent_by=sender,
            message_date=message_date,
            reply_message_id=reply_message_id,
            last_updated=edit_date,
        )

        return message

    return create_message
