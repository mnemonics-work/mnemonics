from rest_framework import viewsets

from mnemonics.models import Category, Expression, Mnemonic, MnemonicType
from mnemonics.serializers import CategorySerializer, ExpressionSerializer, MnemonicSerializer, MnemonicTypeSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ExpressionViewSet(viewsets.ModelViewSet):
    serializer_class = ExpressionSerializer
    queryset = Expression.objects.all()


class MnemonicsViewSet(viewsets.ModelViewSet):
    serializer_class = MnemonicSerializer
    queryset = Mnemonic.objects.all()
    # TODO: Add pagination


class MnemonicTypeViewSet(viewsets.ModelViewSet):
    serializer_class = MnemonicTypeSerializer
    queryset = MnemonicType.objects.all()
