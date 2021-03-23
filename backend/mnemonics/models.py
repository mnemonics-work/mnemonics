from django.db import models
from django.contrib.postgres.fields import ArrayField


class Expression(models.Model):
    title = models.TextField(blank=False, null=False)
    description = models.TextField(blank=True, null=True)


class Mnemonic(models.Model):
    title = models.TextField(blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    expression = models.ForeignKey(Expression, null=True, on_delete=models.SET_NULL, related_name="mnemonics")
    source_url = models.URLField(max_length=2000, blank=True, null=True)
    links = ArrayField(models.URLField(max_length=2000), null=True, blank=True)


class Category(models.Model):
    title = models.TextField(blank=False, null=False)
    parent_topic = models.ForeignKey("self", null=True, on_delete=models.SET_NULL, related_name="child_topics")
    expressions = models.ManyToManyField(Expression, related_name="categories")


class MnemonicType(models.Model):
    label = models.CharField(max_length=256)
    mnemonics = models.ManyToManyField(Mnemonic, related_name="types")
