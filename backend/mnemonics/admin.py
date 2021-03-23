from django.contrib import admin

from .models import Mnemonic, MnemonicType, Expression, Category

admin.site.register(Mnemonic)
admin.site.register(MnemonicType)
admin.site.register(Expression)
admin.site.register(Category)
