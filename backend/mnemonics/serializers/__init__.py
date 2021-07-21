from drf_yasg.utils import swagger_serializer_method
from rest_framework import serializers

from mnemonics.models import Category, Expression, Mnemonic, MnemonicType, Tag


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "title", "parent_topic", "child_topics", "expressions", "tags")


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


class MnemonicCreateUpdateSerializer(MnemonicSerializer):
    types = serializers.ListField(child=serializers.IntegerField())
    tags = serializers.ListField(child=serializers.IntegerField())

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags")
        types = validated_data.pop("types")
        instance.title = validated_data["title"]
        instance.description = validated_data["description"]
        instance.links = validated_data["links"]
        instance.tags.set(tags)
        instance.types.set(types)
        instance.save()
        return instance


class IsAuthorMnemonicSerializer(serializers.ModelSerializer):
    is_author = serializers.SerializerMethodField()

    class Meta:
        model = Mnemonic
        fields = (
            "id",
            "is_author",
        )

    @swagger_serializer_method(serializer_or_field=serializers.BooleanField)
    def get_is_author(self, mnemonic):
        return self.context["user"] == mnemonic.expression.author


class ExpressionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expression
        fields = ("id", "title", "description", "mnemonics", "categories", "tags")


class ExpressionCreateSerializer(ExpressionSerializer):
    mnemonics = MnemonicCreateUpdateSerializer(many=True)
    categories = serializers.ListField(child=serializers.IntegerField())
    tags = serializers.ListField(child=serializers.IntegerField())

    def create(self, validated_data):
        mnemonics = validated_data.pop("mnemonics")
        categories = validated_data.pop("categories")
        tags = validated_data.pop("tags")

        expression = Expression.objects.create(**validated_data)
        expression.categories.set(categories)
        expression.tags.set(tags)
        expression.add_related_mnemonics(mnemonics)
        return expression


class ExpressionUpdateSerializer(serializers.ModelSerializer):
    categories = serializers.ListField(child=serializers.IntegerField())
    tags = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = Expression
        fields = ("title", "description", "categories", "tags")

    def update(self, instance, validated_data):
        categories = validated_data.pop("categories")
        tags = validated_data.pop("tags")
        instance.title = validated_data["title"]
        instance.description = validated_data["description"]
        instance.categories.set(categories)
        instance.tags.set(tags)
        instance.save()
        return instance


class RelatedMnemonicsExpressionSerializer(serializers.Serializer):
    mnemonics = MnemonicCreateUpdateSerializer(many=True)

    def save(self, *args, **kwargs):
        validated_data = {**self.validated_data, **kwargs}
        expression = self.context["expression"]
        mnemonics = validated_data["mnemonics"]
        expression.add_related_mnemonics(mnemonics)
        return expression


class IsAuthorExpressionSerializer(serializers.ModelSerializer):
    is_author = serializers.SerializerMethodField()

    class Meta:
        model = Expression
        fields = (
            "id",
            "is_author",
        )

    @swagger_serializer_method(serializer_or_field=serializers.BooleanField)
    def get_is_author(self, expression):
        return self.context["user"] == expression.author
