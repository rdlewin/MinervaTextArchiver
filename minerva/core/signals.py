import django.dispatch

message_stored = django.dispatch.Signal(providing_args=["message"])
