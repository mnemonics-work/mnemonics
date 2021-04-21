from django_filters.rest_framework import FilterSet, ModelMultipleChoiceFilter
from django_filters.fields import CSVWidget
from mnemonics.models import MnemonicType, Tag


class TagsAndTypesFilter(FilterSet):
    tags = ModelMultipleChoiceFilter(
        field_name="tags", queryset=Tag.objects.all(), widget=CSVWidget
    )
    types = ModelMultipleChoiceFilter(
        field_name="types", queryset=MnemonicType.objects.all(), widget=CSVWidget
    )
