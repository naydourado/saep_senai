import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

export default function CadastroProduto() {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [busca, setBusca] = useState("");
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
      const response = await axios.get(
        "http://127.0.0.1:8000/api/produtos/",
        getAuthHeaders()
      );

      setProdutos(response.data);
      setProdutosFiltrados(response.data);
    } catch (error) {
      console.log("Erro ao carregar produtos:", error);
      setMensagem("Erro ao carregar produtos.");
    }
  };

  const buscarProdutos = () => {
    const termo = busca.toLowerCase().trim();

    const filtrados = produtos.filter((produto) => {
      const nome = produto.nome ? produto.nome.toLowerCase() : "";
      const descricao = produto.descricao
        ? produto.descricao.toLowerCase()
        : "";

      return nome.includes(termo) || descricao.includes(termo);
    });

    setProdutosFiltrados(filtrados);
  };

  useEffect(() => {
    if (busca.trim() === "") {
      setProdutosFiltrados(produtos);
    }
  }, [busca, produtos]);

  const voltarHome = () => {
    window.location.href = "/home";
  };

  const irParaNovoProduto = () => {
    window.location.href = "/novo-produto";
  };

  const editarProduto = (idProduto) => {
    window.location.href = `/editar-produto/${idProduto}`;
  };

  const excluirProduto = async (idProduto) => {
    const confirmar = window.confirm("Deseja excluir este produto?");

    if (!confirmar) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/produtos/${idProduto}/`,
        getAuthHeaders()
      );

      setMensagem("Produto excluído com sucesso.");
      carregarProdutos();
    } catch (error) {
      console.log("Erro ao excluir produto:", error);
      setMensagem("Erro ao excluir produto.");
    }
  };

  return (
    <div className="cadastroPage">
      <header className="topBar">
        <div className="topLeft">
          <button className="backButton" onClick={voltarHome}>
            ← Voltar
          </button>

          <div className="titleDivider"></div>

          <h1 className="pageTitle">Cadastro de Produtos</h1>
        </div>

        <div className="topRight">
          <div className="userBadge">
            <span className="userIcon">◉</span>
            <span>Administrador</span>
          </div>

          <button className="logoutButton">Sair</button>
        </div>
      </header>

      <main className="cadastroContent">
        <section className="produtosCard">
          <div className="produtosCardHeader">
            <h2>Lista de Produtos</h2>

            <button className="novoProdutoButton" onClick={irParaNovoProduto}>
              + Novo Produto
            </button>
          </div>

          <div className="searchArea">
            <input
              type="text"
              placeholder="Buscar produtos por nome ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <button className="buscarButton" onClick={buscarProdutos}>
              Buscar
            </button>
          </div>

          {mensagem && <p className="mensagemBox">{mensagem}</p>}

          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th>Estoque Atual</th>
                  <th>Estoque Mínimo</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((produto) => {
                    const abaixoDoMinimo =
                      Number(produto.quantidadeAtual) <
                      Number(produto.quantidadeMinima);

                    return (
                      <tr key={produto.idProduto}>
                        <td>{produto.nome}</td>
                        <td>{produto.descricao}</td>
                        <td className={abaixoDoMinimo ? "estoqueBaixo" : ""}>
                          {produto.quantidadeAtual}
                        </td>
                        <td>{produto.quantidadeMinima}</td>
                        <td>
                          <div className="acoesCell">
                            <button
                              className="iconButton editButton"
                              onClick={() => editarProduto(produto.idProduto)}
                              title="Editar"
                            >
                              ✎
                            </button>

                            <button
                              className="iconButton deleteButton"
                              onClick={() => excluirProduto(produto.idProduto)}
                              title="Excluir"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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