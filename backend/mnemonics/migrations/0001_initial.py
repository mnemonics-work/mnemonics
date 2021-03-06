# Generated by Django 3.1.7 on 2021-03-16 18:35

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Expression',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Mnemonic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('description', models.TextField(blank=True, null=True)),
                ('source_url', models.URLField(blank=True, max_length=2000, null=True)),
                ('links', django.contrib.postgres.fields.ArrayField(base_field=models.URLField(max_length=2000), blank=True, null=True, size=None)),
                ('expression', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='mnemonics', to='mnemonics.expression')),
            ],
        ),
        migrations.CreateModel(
            name='MnemonicType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=256)),
                ('mnemonics', models.ManyToManyField(related_name='types', to='mnemonics.Mnemonic')),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('expressions', models.ManyToManyField(related_name='categories', to='mnemonics.Expression')),
                ('parent_topic', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='child_topics', to='mnemonics.category')),
            ],
        ),
    ]
