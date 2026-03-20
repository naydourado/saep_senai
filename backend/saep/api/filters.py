import django_filters
from .models import *


class UsuarioFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(field_name='nome', lookup_expr='icontains')
    login = django_filters.CharFilter(field_name='login', lookup_expr='icontains')

    class Meta:
        model = Usuario
        fields = ['nome', 'login']


class ProdutoFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(field_name='nome', lookup_expr='icontains')
    tipo = django_filters.CharFilter(field_name='tipo', lookup_expr='iexact')
    quantidadeMinima = django_filters.NumberFilter(field_name='quantidadeMinima')
    quantidadeAtual = django_filters.NumberFilter(field_name='quantidadeAtual')

    class Meta:
        model = Produto
        fields = ['nome', 'tipo', 'quantidadeMinima', 'quantidadeAtual']


class MovimentacaoFilter(django_filters.FilterSet):
    data_movimentacao = django_filters.DateTimeFilter(field_name='data_movimentacao')
    produto = django_filters.NumberFilter(field_name='produto')
    usuario = django_filters.NumberFilter(field_name='usuario')
    quantidade = django_filters.NumberFilter(field_name='quantidade')

    class Meta:
        model = Movimentacao
        fields = ['data_movimentacao', 'produto', 'usuario', 'quantidade']