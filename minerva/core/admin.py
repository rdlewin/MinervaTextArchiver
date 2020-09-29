from django.contrib import admin

# Register your models here.
from minerva.core.models import Message, Discussion, User, Hashtag, ChatApp, AppUsers, ChatGroup


class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_app_name', 'get_sent_by', 'last_updated', 'content')

    def get_app_name(self, obj):
        return obj.chat_group.application

    get_app_name.short_description = 'Application'

    def get_sent_by(self, obj):
        return obj.sent_by.username

    get_sent_by.short_description = 'Sender'


class AppUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'app', 'user_app_id')


class ChatGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'application', 'name')


admin.site.register(Message, MessageAdmin)
admin.site.register(Discussion)
admin.site.register(Hashtag)
admin.site.register(User)
admin.site.register(ChatApp)
admin.site.register(AppUsers, AppUserAdmin)
admin.site.register(ChatGroup, ChatGroupAdmin)
