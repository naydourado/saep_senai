from django.db import models

class Usuario(models.Model):
    idUsuario = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    login = models.CharField(max_length=100, unique=True)
    senha = models.CharField(max_length=255)

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return self.nome


class Produto(models.Model):
    idProduto = models.AutoField(primary_key=True)
    TIPO_CHOICES = [
        ('smartphones', 'Smartphones'),
        ('notebooks', 'Notebooks'),
        ('smart TVs', 'Smart TVs'),
    ]
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    descricao = models.CharField(max_length=100)
    quantidadeMinima = models.IntegerField()
    quantidadeAtual = models.IntegerField()

    class Meta:
        db_table = 'produtos'

    def __str__(self):
        return self.nome


class Movimentacao(models.Model):
    idMovimentacao = models.AutoField(primary_key=True)
    data_movimentacao = models.DateTimeField()
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, db_column='produto')
    quantidade = models.IntegerField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usuario')

    class Meta:
        db_table = 'movimentacoes'

    def __str__(self):
        return f"{self.produto.nome} - {self.quantidade} unidades"