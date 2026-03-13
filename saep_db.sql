-- script de criação
CREATE DATABASE saep_db;

USE saep_db;

CREATE TABLE usuarios (
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    login VARCHAR(100) UNIQUE,
    senha VARCHAR(255)
);

CREATE TABLE produtos (
	idProduto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    tipo ENUM('smartphones', 'notebooks', 'smart TVs'),
    descricao VARCHAR(100),
    quantidadeMinima INT,
    quantidadeAtual INT
);

CREATE TABLE movimentacoes (
	idMovimentacao INT PRIMARY KEY AUTO_INCREMENT,
    data_movimentacao DATETIME,
    produto INT,
    quantidade INT,
    FOREIGN KEY (produto) REFERENCES produtos(idProduto),
    usuario INT,
    FOREIGN KEY (usuario) REFERENCES usuarios(idUsuario)
);

-- população do banco de dados
INSERT INTO usuarios (nome, login, senha)
VALUES
('João Silva', 'joao.silva', 'senha123'),
('Maria Oliveira', 'maria.oliveira', 'senha456'),
('Carlos Santos', 'carlos.santos', 'senha789'),
('Ana Souza', 'ana.souza', 'senha101'),
('Roberto Lima', 'roberto.lima', 'senha202');

INSERT INTO produtos (nome, tipo, descricao, quantidadeMinima, quantidadeAtual)
VALUES
('iPhone 12', 'smartphones', 'Smartphone Apple com 128GB', 5, 20),
('Samsung Galaxy S21', 'smartphones', 'Smartphone Samsung com 128GB', 5, 10),
('Dell Inspiron 15', 'notebooks', 'Notebook Dell com 8GB de RAM e 1TB de HD', 3, 15),
('Smart TV LG 50"', 'smart TVs', 'TV 4K LED 50 polegadas', 2, 8),
('MacBook Pro', 'notebooks', 'MacBook Pro com M1 e 256GB', 2, 5);

INSERT INTO movimentacoes (data_movimentacao, produto, quantidade, usuario)
VALUES
('2023-03-01 10:00:00', 1, 5, 1),
('2023-03-02 11:30:00', 2, 3, 2),
('2023-03-03 14:00:00', 3, 2, 3),
('2023-03-04 15:30:00', 4, 1, 4),
('2023-03-05 16:45:00', 5, 1, 5);