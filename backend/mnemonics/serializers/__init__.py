from rest_framework import serializers

from mnemonics.models import Category, Expression, Mnemonic, MnemonicType


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "title", "parent_topic", "child_topics", "expressions")


class ExpressionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expression
        fields = ("id", "title", "description", "mnemonics", "categories")


class MnemonicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mnemonic
        fields = ("id", "title", "description", "expression", "source_url", "links", "types")


class MnemonicTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MnemonicType
        fields = ("id", "label", "mnemonics")
