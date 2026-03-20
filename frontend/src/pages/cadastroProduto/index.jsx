// src/pages/cadastroProduto/index.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

export default function CadastroProduto() {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState("");

    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [quantidadeMinima, setQuantidadeMinima] = useState("");
    const [quantidadeAtual, setQuantidadeAtual] = useState("");

    const [editandoId, setEditandoId] = useState(null);
    const [mensagem, setMensagem] = useState("");

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
            // Busca os produtos na API
            const response = await axios.get(
                "http://127.0.0.1:8000/api/produtos/",
                getAuthHeaders()
            );

            setProdutos(response.data);
        } catch (error) {
            console.log("Erro ao carregar produtos: ", error);
            setMensagem("Erro ao carregar produtos.");
        }
    };

    const buscarProdutos = async (e) => {
        e.preventDefault();

        try {
            // Se a busca estiver vazia, volta a listar tudo
            if (!busca.trim()) {
                carregarProdutos();
                return;
            }

            // Faz a busca pelo nome do produto
            const response = await axios.get(
                `http://127.0.0.1:8000/api/produtos/?nome=${busca}`,
                getAuthHeaders()
            );

            setProdutos(response.data);
        } catch (error) {
            console.log("Erro ao buscar produtos: ", error);
            setMensagem("Erro ao buscar produtos.");
        }
    };

    const limparFormulario = () => {
        setNome("");
        setTipo("");
        setDescricao("");
        setQuantidadeMinima("");
        setQuantidadeAtual("");
        setEditandoId(null);
    };

    const validarFormulario = () => {
        // Valida se todos os campos foram preenchidos
        if (!nome || !tipo || !descricao || quantidadeMinima === "" || quantidadeAtual === "") {
            setMensagem("Preencha todos os campos.");
            return false;
        }

        // Valida se as quantidades são numéricas
        if (isNaN(quantidadeMinima) || isNaN(quantidadeAtual)) {
            setMensagem("Quantidade mínima e quantidade atual devem ser números.");
            return false;
        }

        // Valida se as quantidades não são negativas
        if (Number(quantidadeMinima) < 0 || Number(quantidadeAtual) < 0) {
            setMensagem("As quantidades não podem ser negativas.");
            return false;
        }

        return true;
    };

    const salvarProduto = async (e) => {
        e.preventDefault();
        setMensagem("");

        // Faz as validações antes de salvar
        if (!validarFormulario()) {
            return;
        }

        const dadosProduto = {
            nome,
            tipo,
            descricao,
            quantidadeMinima: Number(quantidadeMinima),
            quantidadeAtual: Number(quantidadeAtual),
        };

        try {
            // Se estiver editando, faz PUT
            if (editandoId) {
                await axios.put(
                    `http://127.0.0.1:8000/api/produtos/${editandoId}/`,
                    dadosProduto,
                    getAuthHeaders()
                );

                setMensagem("Produto atualizado com sucesso.");
            } else {
                // Se não estiver editando, faz POST
                await axios.post(
                    "http://127.0.0.1:8000/api/produtos/",
                    dadosProduto,
                    getAuthHeaders()
                );

                setMensagem("Produto cadastrado com sucesso.");
            }

            limparFormulario();
            carregarProdutos();
        } catch (error) {
            console.log("Erro ao salvar produto: ", error);
            setMensagem("Erro ao salvar produto.");
        }
    };

    const editarProduto = (produto) => {
        // Preenche o formulário com os dados do produto selecionado
        setNome(produto.nome);
        setTipo(produto.tipo);
        setDescricao(produto.descricao);
        setQuantidadeMinima(produto.quantidadeMinima);
        setQuantidadeAtual(produto.quantidadeAtual);
        setEditandoId(produto.idProduto);
        setMensagem("");
    };

    const excluirProduto = async (id) => {
        const confirmar = window.confirm("Deseja realmente excluir este produto?");

        if (!confirmar) {
            return;
        }

        try {
            // Exclui o produto da API
            await axios.delete(
                `http://127.0.0.1:8000/api/produtos/${id}/`,
                getAuthHeaders()
            );

            setMensagem("Produto excluído com sucesso.");
            carregarProdutos();

            // Se estiver editando o mesmo produto, limpa o formulário
            if (editandoId === id) {
                limparFormulario();
            }
        } catch (error) {
            console.log("Erro ao excluir produto: ", error);
            setMensagem("Erro ao excluir produto.");
        }
    };

    const voltarHome = () => {
        // Volta para a interface principal
        window.location.href = "/home";
    };

    return (
        <div className="cadastroProdutoPage">

            {/* Cabeçalho */}
            <header className="cadastroHeader">
                <div>
                    <h1>Cadastro de Produto</h1>
                    <p>Gerencie os produtos cadastrados no sistema</p>
                </div>

                <button className="voltarButton" onClick={voltarHome}>
                    Voltar
                </button>
            </header>

            <main className="cadastroMain">

                {/* Formulário */}
                <section className="formCard">
                    <h2>{editandoId ? "Editar Produto" : "Novo Produto"}</h2>

                    <form className="produtoForm" onSubmit={salvarProduto}>
                        <input
                            type="text"
                            placeholder="Nome do produto"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value="">Selecione o tipo</option>
                            <option value="smartphones">Smartphones</option>
                            <option value="notebooks">Notebooks</option>
                            <option value="smart TVs">Smart TVs</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Quantidade mínima"
                            value={quantidadeMinima}
                            onChange={(e) => setQuantidadeMinima(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Quantidade atual"
                            value={quantidadeAtual}
                            onChange={(e) => setQuantidadeAtual(e.target.value)}
                        />

                        <div className="formButtons">
                            <button type="submit" className="salvarButton">
                                {editandoId ? "Atualizar" : "Cadastrar"}
                            </button>

                            <button
                                type="button"
                                className="limparButton"
                                onClick={limparFormulario}
                            >
                                Limpar
                            </button>
                        </div>
                    </form>

                    {mensagem && <p className="mensagem">{mensagem}</p>}
                </section>

                {/* Busca e tabela */}
                <section className="tabelaCard">
                    <div className="tabelaHeader">
                        <h2>Produtos Cadastrados</h2>

                        <form className="buscaArea" onSubmit={buscarProdutos}>
                            <input
                                type="text"
                                placeholder="Buscar por nome"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />
                            <button type="submit">Buscar</button>
                        </form>
                    </div>

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
                                    <th>Ações</th>
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
                                            <td className="acoes">
                                                <button
                                                    className="editarButton"
                                                    onClick={() => editarProduto(produto)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="excluirButton"
                                                    onClick={() => excluirProduto(produto.idProduto)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="semDados">
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