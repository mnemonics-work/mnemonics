from rest_framework import serializers

from mnemonics.models import Category, Expression, Mnemonic, MnemonicType, Tag


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "title", "parent_topic", "child_topics", "expressions", "tags")


class ExpressionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expression
        fields = ("id", "title", "description", "mnemonics", "categories", "tags")


class MnemonicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mnemonic
        fields = (
            "id",
            "title",
            "description",
            "expression",
            "source_url",
            "links",
            "types",
            "tags",
        )


class MnemonicTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MnemonicType
        fields = ("id", "label", "mnemonics")


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "label")


class MnemonicCreateSerializer(MnemonicSerializer):
    types = serializers.ListField(child=serializers.IntegerField())
    tags = serializers.ListField(child=serializers.IntegerField())


class ExpressionCreateSerializer(ExpressionSerializer):
    mnemonics = MnemonicCreateSerializer(many=True)
    categories = serializers.ListField(child=serializers.IntegerField())
    tags = serializers.ListField(child=serializers.IntegerField())

    def create(self, validated_data):
        mnemonics = validated_data.pop("mnemonics")
        categories = validated_data.pop("categories")
        tags = validated_data.pop("tags")

        expression = Expression.objects.create(**validated_data)
        expression.categories.set(categories)
        expression.tags.set(tags)

        for mnemonic_data in mnemonics:
            tags = mnemonic_data.pop("tags")
            types = mnemonic_data.pop("types")
            mnemonic = Mnemonic.objects.create(expression=expression, **mnemonic_data)
            mnemonic.tags.set(tags)
            mnemonic.types.set(types)
        return expression
