from django.contrib import admin

# Register your models here.
from minerva.core.models import Message, Discussion, User, Hashtag, ChatApp, AppUsers, ChatGroup

admin.site.register(Message)
admin.site.register(Discussion)
admin.site.register(Hashtag)
admin.site.register(User)
admin.site.register(ChatApp)
admin.site.register(AppUsers)
admin.site.register(ChatGroup)
