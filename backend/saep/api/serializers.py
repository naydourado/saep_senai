from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['idUsuario', 'nome', 'login', 'senha']
        extra_kwargs = {
            'senha': {'write_only': True}
        }

    def create(self, validated_data):
        nome = validated_data['nome']
        login = validated_data['login']
        senha = validated_data['senha']

        if User.objects.filter(username=login).exists():
            raise serializers.ValidationError({
                'login': 'Já existe um usuário autenticável com esse login.'
            })

        # cria no auth_user
        User.objects.create_user(
            username=login,
            password=senha,
            first_name=nome,
            is_active=True
        )

        # cria na sua tabela usuarios
        usuario = Usuario.objects.create(
            nome=nome,
            login=login,
            senha=senha
        )

        return usuario

    def update(self, instance, validated_data):
        login_antigo = instance.login

        novo_nome = validated_data.get('nome', instance.nome)
        novo_login = validated_data.get('login', instance.login)
        nova_senha = validated_data.get('senha', instance.senha)

        try:
            user = User.objects.get(username=login_antigo)
        except User.DoesNotExist:
            user = None

        if user:
            if novo_login != login_antigo and User.objects.filter(username=novo_login).exists():
                raise serializers.ValidationError({
                    'login': 'Já existe um usuário autenticável com esse login.'
                })

            user.username = novo_login
            user.first_name = novo_nome
            user.is_active = True

            if 'senha' in validated_data:
                user.set_password(nova_senha)

            user.save()

        instance.nome = novo_nome
        instance.login = novo_login

        if 'senha' in validated_data:
            instance.senha = nova_senha

        instance.save()
        return instance


class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['idProduto', 'nome', 'tipo', 'descricao', 'quantidadeMinima', 'quantidadeAtual']


class MovimentacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimentacao
        fields = '__all__'