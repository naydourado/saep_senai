// src/pages/gestaoEstoque/index.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

export default function GestaoEstoque() {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [tipoMovimentacao, setTipoMovimentacao] = useState("");
    const [dataMovimentacao, setDataMovimentacao] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [alerta, setAlerta] = useState("");

    useEffect(() => {
        carregarProdutos();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const carregarProdutos = async () => {
        try {
            // Busca todos os produtos cadastrados
            const response = await axios.get(
                "http://127.0.0.1:8000/api/produtos/",
                getAuthHeaders()
            );

            // Ordena os produtos em ordem alfabética pelo nome
            const produtosOrdenados = [...response.data].sort((a, b) =>
                a.nome.localeCompare(b.nome)
            );

            setProdutos(produtosOrdenados);
        } catch (error) {
            console.log("Erro ao carregar produtos: ", error);
            setMensagem("Erro ao carregar os produtos.");
        }
    };

    const limparFormulario = () => {
        setProdutoSelecionado("");
        setTipoMovimentacao("");
        setDataMovimentacao("");
        setQuantidade("");
        setAlerta("");
    };

    const registrarMovimentacao = async (e) => {
        e.preventDefault();
        setMensagem("");
        setAlerta("");

        // Validações dos campos
        if (!produtoSelecionado || !tipoMovimentacao || !dataMovimentacao || !quantidade) {
            setMensagem("Preencha todos os campos.");
            return;
        }

        if (isNaN(quantidade) || Number(quantidade) <= 0) {
            setMensagem("Informe uma quantidade válida.");
            return;
        }

        try {
            // Busca o produto selecionado completo
            const produto = produtos.find(
                (item) => String(item.idProduto) === String(produtoSelecionado)
            );

            if (!produto) {
                setMensagem("Produto não encontrado.");
                return;
            }

            let novaQuantidade = Number(produto.quantidadeAtual);

            // Verifica se a movimentação é entrada ou saída
            if (tipoMovimentacao === "entrada") {
                novaQuantidade += Number(quantidade);
            } else if (tipoMovimentacao === "saida") {
                // Verifica se há estoque suficiente para saída
                if (Number(quantidade) > Number(produto.quantidadeAtual)) {
                    setMensagem("Quantidade de saída maior que o estoque disponível.");
                    return;
                }

                novaQuantidade -= Number(quantidade);
            }

            // Atualiza o estoque do produto
            await axios.put(
                `http://127.0.0.1:8000/api/produtos/${produto.idProduto}/`,
                {
                    nome: produto.nome,
                    tipo: produto.tipo,
                    descricao: produto.descricao,
                    quantidadeMinima: produto.quantidadeMinima,
                    quantidadeAtual: novaQuantidade,
                },
                getAuthHeaders()
            );

            // Pega o id do usuário logado salvo no localStorage, se existir
            const idUsuario = localStorage.getItem("idUsuario");

            // Registra a movimentação no banco
            if (idUsuario) {
                await axios.post(
                    "http://127.0.0.1:8000/api/movimentacoes/",
                    {
                        data_movimentacao: dataMovimentacao,
                        produto: Number(produto.idProduto),
                        quantidade: Number(quantidade),
                        usuario: Number(idUsuario),
                    },
                    getAuthHeaders()
                );
            }

            // Exibe alerta se a saída deixar abaixo do mínimo
            if (
                tipoMovimentacao === "saida" &&
                novaQuantidade < Number(produto.quantidadeMinima)
            ) {
                setAlerta(
                    `Atenção: o produto "${produto.nome}" ficou abaixo do estoque mínimo.`
                );
            }

            setMensagem("Movimentação registrada com sucesso.");
            limparFormulario();
            carregarProdutos();
        } catch (error) {
            console.log("Erro ao registrar movimentação: ", error);
            setMensagem("Erro ao registrar movimentação.");
        }
    };

    const voltarHome = () => {
        // Volta para a interface principal
        window.location.href = "/home";
    };

    return (
        <div className="gestaoPage">

            {/* Cabeçalho */}
            <header className="gestaoHeader">
                <div>
                    <h1>Gestão de Estoque</h1>
                    <p>Controle as entradas e saídas dos produtos</p>
                </div>

                <button className="voltarButton" onClick={voltarHome}>
                    Voltar
                </button>
            </header>

            <main className="gestaoMain">

                {/* Formulário de movimentação */}
                <section className="movimentacaoCard">
                    <h2>Nova Movimentação</h2>

                    <form className="movimentacaoForm" onSubmit={registrarMovimentacao}>

                        {/* Seleção do produto */}
                        <select
                            value={produtoSelecionado}
                            onChange={(e) => setProdutoSelecionado(e.target.value)}
                        >
                            <option value="">Selecione um produto</option>

                            {produtos.map((produto) => (
                                <option key={produto.idProduto} value={produto.idProduto}>
                                    {produto.nome}
                                </option>
                            ))}
                        </select>

                        {/* Tipo da movimentação */}
                        <select
                            value={tipoMovimentacao}
                            onChange={(e) => setTipoMovimentacao(e.target.value)}
                        >
                            <option value="">Selecione o tipo de movimentação</option>
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saída</option>
                        </select>

                        {/* Data da movimentação */}
                        <input
                            type="datetime-local"
                            value={dataMovimentacao}
                            onChange={(e) => setDataMovimentacao(e.target.value)}
                        />

                        {/* Quantidade movimentada */}
                        <input
                            type="number"
                            placeholder="Quantidade"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />

                        <button type="submit" className="registrarButton">
                            Registrar Movimentação
                        </button>
                    </form>

                    {/* Mensagens */}
                    {mensagem && <p className="mensagem">{mensagem}</p>}
                    {alerta && <p className="alerta">{alerta}</p>}
                </section>

                {/* Lista de produtos */}
                <section className="produtosCard">
                    <h2>Produtos em Estoque</h2>

                    <div className="tableWrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Descrição</th>
                                    <th>Qtd. Mínima</th>
                                    <th>Qtd. Atual</th>
                                </tr>
                            </thead>

                            <tbody>
                                {produtos.length > 0 ? (
                                    produtos.map((produto) => (
                                        <tr key={produto.idProduto}>
                                            <td>{produto.idProduto}</td>
                                            <td>{produto.nome}</td>
                                            <td>{produto.tipo}</td>
                                            <td>{produto.descricao}</td>
                                            <td>{produto.quantidadeMinima}</td>
                                            <td>{produto.quantidadeAtual}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="semDados">
                                            Nenhum produto encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}