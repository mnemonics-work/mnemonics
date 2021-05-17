from rest_framework import filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from mnemonics.filters import MnemonicsFilter
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

    def get_ancestors_of_category(self, category):
        category_to_query = category
        ancestors = [category]
        while category_to_query is not None:
            parent = category_to_query.parent_topic
            if parent is not None:
                ancestors.append(parent)
            category_to_query = parent
        return ancestors

    @swagger_auto_schema(responses={200: CategorySerializer(many=True)})
    @action(detail=True)
    def related_categories(self, request, pk=None):
        expression_obj = self.get_object()
        directly_related_categories = expression_obj.categories.all()
        related_categories = []
        for category in directly_related_categories:
            related_categories += self.get_ancestors_of_category(category)
        distinct_related_categories = list(set(related_categories))
        serializer = CategorySerializer(distinct_related_categories, many=True)
        return Response(serializer.data)


class MnemonicsViewSet(viewsets.ModelViewSet):
    serializer_class = MnemonicSerializer
    queryset = Mnemonic.objects.all()
    pagination_class = LimitOffsetPagination
    search_fields = ["title", "description"]
    filter_class = MnemonicsFilter
    filter_backends = (filters.SearchFilter, DjangoFilterBackend)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "ids",
                openapi.IN_QUERY,
                description="Mnemonic ids separated by commas",
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER),
            ),
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
