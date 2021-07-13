from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField


class Tag(models.Model):
    label = models.CharField(max_length=256)

    def __str__(self):
        return "{} - {}".format(self.pk, self.label)


class Expression(models.Model):
    title = models.TextField(blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name="expressions", blank=True)
    author = models.ForeignKey(
        User,
        null=True,
        on_delete=models.SET_NULL,
        related_name="expressions",
        blank=True,
    )

    created_on = models.DateTimeField(
        auto_now_add=True, editable=False, blank=True, null=True
    )
    modified_on = models.DateTimeField(
        auto_now=True, editable=False, blank=True, null=True
    )

    def __str__(self):
        return "{} - {}".format(self.pk, self.title)


class Mnemonic(models.Model):
    title = models.TextField(blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    expression = models.ForeignKey(
        Expression,
        null=True,
        on_delete=models.SET_NULL,
        related_name="mnemonics",
        blank=True,
    )
    source_url = models.URLField(max_length=2000, blank=True, null=True)
    links = ArrayField(models.URLField(max_length=2000), null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name="mnemonics", blank=True)

    created_on = models.DateTimeField(
        auto_now_add=True, editable=False, blank=True, null=True
    )
    modified_on = models.DateTimeField(
        auto_now=True, editable=False, blank=True, null=True
    )

    def __str__(self):
        return "{} - {}".format(self.pk, self.title)


class Category(models.Model):
    title = models.TextField(blank=False, null=False)
    parent_topic = models.ForeignKey(
        "self",
        null=True,
        on_delete=models.SET_NULL,
        related_name="child_topics",
        blank=True,
    )
    expressions = models.ManyToManyField(
        Expression, related_name="categories", blank=True
    )
    tags = models.ManyToManyField(Tag, related_name="categories", blank=True)

    def __str__(self):
        return "{} - {}".format(self.pk, self.title)


class MnemonicType(models.Model):
    label = models.CharField(max_length=256)
    mnemonics = models.ManyToManyField(Mnemonic, related_name="types", blank=True)

    def __str__(self):
        return "{} - {}".format(self.pk, self.label)


class Profile(models.Model):
    fullname = models.CharField(max_length=256)
    email = models.CharField(max_length=256)
    google_id = models.CharField(null=True, blank=True, max_length=128)
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)

    def __str__(self):
        return "{} - {}".format(self.user, self.fullname)
