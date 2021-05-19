from django.db import models


class Event(models.Model):
    class EventType(models.TextChoices):
        MNEMONIC_VIEW = ("MV",)

    datetime = models.DateTimeField()
    user = models.ForeignKey(
        "auth.User", null=True, related_name="events", on_delete=models.SET_NULL
    )
    data = models.JSONField(null=True, blank=True)
    eventType = models.CharField(max_length=2, choices=EventType.choices)
