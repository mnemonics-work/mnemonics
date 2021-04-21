from django.db import models
from django.contrib.postgres.fields import ArrayField


class Tag(models.Model):
    label = models.CharField(max_length=256)


class Expression(models.Model):
    title = models.TextField(blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name="expressions", blank=True)


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


class MnemonicType(models.Model):
    label = models.CharField(max_length=256)
    mnemonics = models.ManyToManyField(Mnemonic, related_name="types", blank=True)
