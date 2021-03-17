# Generated by Django 3.1.7 on 2021-03-15 16:14

import django.core.files.storage
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('RecipeApp', '0011_auto_20210314_2316'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecipeImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PhotoFile', models.ImageField(null=True, storage=django.core.files.storage.FileSystemStorage(base_url='/media', location=None), upload_to='')),
            ],
        ),
        migrations.AlterField(
            model_name='recipe',
            name='PhotoFile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='RecipeApp.recipeimage'),
        ),
    ]