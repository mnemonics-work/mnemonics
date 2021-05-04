from django_filters.rest_framework import FilterSet, ModelMultipleChoiceFilter
from django_filters.fields import CSVWidget
from mnemonics.models import MnemonicType, Tag
from django_filters import Filter
from django_filters.constants import EMPTY_VALUES
from rest_framework.serializers import ValidationError


class ListFilter(Filter):
    def filter(self, qs, value):
        if value in EMPTY_VALUES:
            return qs
        values_list = value.split(",")
        if not all(item.isdigit() for item in values_list):
            raise ValidationError(
                "Values for %s should be integers" % str(self.field_name)
            )
        return super(ListFilter, self).filter(qs, values_list)


class MnemonicsFilter(FilterSet):
    tags = ModelMultipleChoiceFilter(
        field_name="tags", queryset=Tag.objects.all(), widget=CSVWidget
    )
    types = ModelMultipleChoiceFilter(
        field_name="types", queryset=MnemonicType.objects.all(), widget=CSVWidget
    )
    ids = ListFilter(field_name="id", lookup_expr="in")
