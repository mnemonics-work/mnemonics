from django.conf.urls import url, include
from mnemonics.views import CategoryViewSet, ExpressionViewSet, MnemonicsViewSet, MnemonicTypeViewSet
from rest_framework import routers

app_name = 'mnemonics'

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'mnemonics', MnemonicsViewSet, basename="mnemonics")
router.register(r'expressions', ExpressionViewSet, basename="expressions")
router.register(r'categories', CategoryViewSet, basename="categories")
router.register(r'mnemonicTypes', MnemonicTypeViewSet, basename="mnemonic-types")

urlpatterns = [
    url(r'', include(router.urls)),
]
