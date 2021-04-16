from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

from mnemonics.models import Category, Expression, Mnemonic, MnemonicType, Tag
from mnemonics.serializers import (
    CategorySerializer,
    ExpressionSerializer,
    MnemonicSerializer,
    MnemonicTypeSerializer,
    TagSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ExpressionViewSet(viewsets.ModelViewSet):
    serializer_class = ExpressionSerializer
    queryset = Expression.objects.all()


class MnemonicsViewSet(viewsets.ModelViewSet):
    serializer_class = MnemonicSerializer
    queryset = Mnemonic.objects.all()
    pagination_class = LimitOffsetPagination


class MnemonicTypeViewSet(viewsets.ModelViewSet):
    serializer_class = MnemonicTypeSerializer
    queryset = MnemonicType.objects.all()


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
