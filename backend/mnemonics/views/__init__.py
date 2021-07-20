from rest_framework import filters
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from mnemonics.filters import MnemonicsFilter, CategoriesFilter
from mnemonics.models import Category, Expression, Mnemonic, MnemonicType, Tag
from mnemonics.permissions import IsExpressionAuthor, IsMnemonicAuthor
from mnemonics.serializers import (
    CategorySerializer,
    ExpressionSerializer,
    ExpressionCreateSerializer,
    ExpressionUpdateSerializer,
    MnemonicSerializer,
    MnemonicCreateUpdateSerializer,
    IsAuthorMnemonicSerializer,
    MnemonicTypeSerializer,
    TagSerializer,
    RelatedMnemonicsExpressionSerializer,
    IsAuthorExpressionSerializer,
)


class BaseViewSet(viewsets.GenericViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    filter_class = CategoriesFilter
    filter_backends = (DjangoFilterBackend,)

    def get_expressions_from_categories(self, categories):
        expressions = []
        for category in categories:
            category_expressions = category.expressions.all()
            for expression in category_expressions:
                if expression not in expressions:
                    expressions.append(expression)

        return expressions

    def get_child_categories(self, category):
        children = [category]
        child_topics = category.child_topics.all()
        if child_topics and len(child_topics) > 0:
            for child in child_topics:
                children += self.get_child_categories(child)
        return children

    @swagger_auto_schema(responses={200: ExpressionSerializer(many=True)})
    @action(detail=True)
    def related_expressions(self, request, pk=None):
        category = self.get_object()
        related_topics = list(set(self.get_child_categories(category)))
        related_expressions = self.get_expressions_from_categories(
            categories=related_topics
        )
        serializer = ExpressionSerializer(related_expressions, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "ids",
                openapi.IN_QUERY,
                description="Categories ids separated by commas",
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER),
            ),
        ],
    )
    def list(self, request, *args, **kwargs):
        return super(CategoryViewSet, self).list(request, args, kwargs)


class ExpressionViewSet(BaseViewSet, viewsets.ModelViewSet):
    serializer_class = ExpressionSerializer
    queryset = Expression.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsExpressionAuthor]

    def get_ancestors_of_category(self, category):
        category_to_query = category
        ancestors = [category]
        while category_to_query is not None:
            parent = category_to_query.parent_topic
            if parent is not None:
                ancestors.append(parent)
            category_to_query = parent
        return ancestors

    @swagger_auto_schema(
        request_body=ExpressionCreateSerializer, responses={201: ExpressionSerializer()}
    )
    def create(self, request, *args, **kwargs):
        serializer = ExpressionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        expression = serializer.save(author=self.request.user)
        serializer = self.get_serializer(expression)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        request_body=ExpressionUpdateSerializer, responses={200: ExpressionSerializer()}
    )
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ExpressionUpdateSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        expression = serializer.save()
        serializer = self.get_serializer(expression)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=RelatedMnemonicsExpressionSerializer,
        responses={201: ExpressionSerializer()},
    )
    @action(methods=["POST"], detail=True)
    def add_related_mnemonics(self, request, *args, **kwargs):
        expression = self.get_object()
        serializer = RelatedMnemonicsExpressionSerializer(
            data=request.data, context={"expression": expression}
        )
        serializer.is_valid(raise_exception=True)
        expression = serializer.save()
        serializer = self.get_serializer(expression)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(responses={201: CategorySerializer(many=True)})
    @action(detail=True)
    def related_categories(self, request, pk=None):
        expression_obj = self.get_object()
        directly_related_categories = expression_obj.categories.all()
        related_categories = []
        for category in directly_related_categories:
            related_categories += self.get_ancestors_of_category(category)
        distinct_related_categories = list(set(related_categories))
        serializer = CategorySerializer(distinct_related_categories, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, serializer_class=IsAuthorExpressionSerializer)
    def is_author(self, request, *args, **kwargs):
        expression = self.get_object()
        serializer = IsAuthorExpressionSerializer(
            expression, context={"user": request.user}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class MnemonicsViewSet(
    BaseViewSet,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.UpdateModelMixin,
    viewsets.mixins.DestroyModelMixin,
):
    serializer_class = MnemonicSerializer
    queryset = Mnemonic.objects.all()
    pagination_class = LimitOffsetPagination
    permission_classes = [IsAuthenticatedOrReadOnly, IsMnemonicAuthor]
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

    @swagger_auto_schema(
        request_body=MnemonicCreateUpdateSerializer,
        responses={200: MnemonicSerializer()},
    )
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = MnemonicCreateUpdateSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        mnemonic = serializer.save()
        serializer = self.get_serializer(mnemonic)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, serializer_class=IsAuthorMnemonicSerializer)
    def is_author(self, request, *args, **kwargs):
        mnemonic = self.get_object()
        serializer = IsAuthorMnemonicSerializer(
            mnemonic, context={"user": request.user}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class MnemonicTypeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MnemonicTypeSerializer
    queryset = MnemonicType.objects.all()


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
