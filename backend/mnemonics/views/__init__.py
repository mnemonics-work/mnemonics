from rest_framework import filters
from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from mnemonics.filters import TagsAndTypesFilter
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
    search_fields = ["title", "description"]
    filter_class = TagsAndTypesFilter
    filter_backends = (filters.SearchFilter, DjangoFilterBackend)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "tags",
                openapi.IN_QUERY,
                description="Tags ids separated by commas",
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER),
            ),
            openapi.Parameter(
                "types",
                openapi.IN_QUERY,
                description="Mnemonic types ids separated by commas",
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER),
            ),
        ],
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, args, kwargs)


class MnemonicTypeViewSet(viewsets.ModelViewSet):
    serializer_class = MnemonicTypeSerializer
    queryset = MnemonicType.objects.all()


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
