# Generated by Django 3.1.7 on 2021-03-15 05:16

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RecipeApp', '0010_auto_20210314_1312'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='PhotoFile',
            field=models.ImageField(null=True, storage=django.core.files.storage.FileSystemStorage(base_url='/media', location=None), upload_to=''),
        ),
    ]
