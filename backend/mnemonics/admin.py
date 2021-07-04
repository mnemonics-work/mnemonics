from django.contrib import admin

from .models import Mnemonic, MnemonicType, Expression, Category, Tag, Profile

admin.site.register(Mnemonic)
admin.site.register(MnemonicType)
admin.site.register(Expression)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Profile)
