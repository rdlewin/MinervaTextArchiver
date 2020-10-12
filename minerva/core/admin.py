import json

from django.contrib import admin

from minerva.core.models import Message, Discussion, User, Hashtag, ChatApp, AppUser, ChatGroup


class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_app_name', 'get_sent_by', 'last_updated', 'get_discussions', 'content')

    def get_app_name(self, obj):
        return obj.chat_group.application

    get_app_name.short_description = 'Application'

    def get_sent_by(self, obj):
        return obj.sent_by.username

    def get_discussions(self, obj):
        return json.dumps([str(discussion) for discussion in obj.discussions.all()])

    get_discussions.short_description = 'Discussions'

    get_sent_by.short_description = 'Sender'


class DiscussionAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_message', 'hashtag')


class AppUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'app', 'user_app_id')


class ChatGroupInline(admin.TabularInline):
    model = ChatGroup.members.through
    extra = 1


class UserAdmin(admin.ModelAdmin):
    fields = ('username', 'password',
              ('first_name', 'last_name'),
              'email',
              'phone_number')
    inlines = [
        ChatGroupInline
    ]

    def get_chat_groups(self, obj):
        return obj.chat_groups.all()

    get_chat_groups.short_description = 'Chat Groups'


class ChatGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'application', 'name')


admin.site.register(Message, MessageAdmin)
admin.site.register(Discussion, DiscussionAdmin)
admin.site.register(Hashtag)
admin.site.register(User, UserAdmin)
admin.site.register(ChatApp)
admin.site.register(AppUser, AppUserAdmin)
admin.site.register(ChatGroup, ChatGroupAdmin)
