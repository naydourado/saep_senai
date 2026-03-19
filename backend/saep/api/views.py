from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Usuario, Produto, Movimentacao
from .serializers import UsuarioSerializer, ProdutoSerializer, MovimentacaoSerializer
from .filters import *


class UsuarioViewSet(ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_class = UsuarioFilter

    def get_queryset(self):
        qs = super().get_queryset()

        if self.request.user.is_staff:
            return qs

        return qs

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        return Response({
            "username": request.user.username,
            "is_superuser": request.user.is_superuser,
            "is_staff": request.user.is_staff,
            "is_active": request.user.is_active,
        })


class ProdutoViewSet(ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_class = ProdutoFilter

    def get_queryset(self):
        qs = super().get_queryset()

        if self.request.user.is_staff:
            return qs

        return qs

class MovimentacaoViewSet(ModelViewSet):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_class = MovimentacaoFilter

    def get_queryset(self):
        qs = super().get_queryset().select_related('produto', 'usuario')

        if self.request.user.is_staff:
            return qs

        return qs