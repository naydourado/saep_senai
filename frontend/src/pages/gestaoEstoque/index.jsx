// Importações principais do React
import React, { useEffect, useState } from "react";

// Biblioteca para requisições HTTP
import axios from "axios";

// Estilos da página
import "./styles.css";

export default function GestaoEstoque() {
  // Lista de produtos vindos da API
  const [produtos, setProdutos] = useState([]);

  // Campos do formulário
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [tipoMovimentacao, setTipoMovimentacao] = useState("");
  const [dataMovimentacao, setDataMovimentacao] = useState("");
  const [quantidade, setQuantidade] = useState("");

  // Mensagens de retorno
  const [mensagem, setMensagem] = useState("");
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Recupera o token salvo
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Busca os produtos do sistema
  const carregarProdutos = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/produtos/",
        getAuthHeaders()
      );

      // Ordenação alfabética
      const produtosOrdenados = [...response.data].sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );

      setProdutos(produtosOrdenados);
    } catch (error) {
      console.log("Erro ao carregar produtos: ", error);
      setMensagem("Erro ao carregar os produtos.");
    }
  };

  // Limpa os campos do formulário
  const limparFormulario = () => {
    setProdutoSelecionado("");
    setTipoMovimentacao("");
    setDataMovimentacao("");
    setQuantidade("");
    setAlerta("");
  };

  // Registra a movimentação
  const registrarMovimentacao = async (e) => {
    e.preventDefault();
    setMensagem("");
    setAlerta("");

    if (
      !produtoSelecionado ||
      !tipoMovimentacao ||
      !dataMovimentacao ||
      !quantidade
    ) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (isNaN(quantidade) || Number(quantidade) <= 0) {
      setMensagem("Informe uma quantidade válida.");
      return;
    }

    try {
      const produto = produtos.find(
        (item) => String(item.idProduto) === String(produtoSelecionado)
      );

      if (!produto) {
        setMensagem("Produto não encontrado.");
        return;
      }

      let novaQuantidade = Number(produto.quantidadeAtual);

      if (tipoMovimentacao === "entrada") {
        novaQuantidade += Number(quantidade);
      } else if (tipoMovimentacao === "saida") {
        if (Number(quantidade) > Number(produto.quantidadeAtual)) {
          setMensagem("Quantidade de saída maior que o estoque disponível.");
          return;
        }

        novaQuantidade -= Number(quantidade);
      }

      // Atualiza estoque do produto
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

      // Registra movimentação
      const idUsuario = localStorage.getItem("idUsuario");

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

      // Alerta se ficar abaixo do mínimo
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

  // Voltar para home
  const voltarHome = () => {
    window.location.href = "/home";
  };

  // Produtos abaixo do mínimo
  const produtosAbaixoDoMinimo = produtos.filter(
    (produto) => Number(produto.quantidadeAtual) < Number(produto.quantidadeMinima)
  );

  return (
    <div className="gestaoPage">
      {/* ================= TOPO ================= */}
      <header className="topBar">
        <div className="topLeft">
          <button className="backButton" onClick={voltarHome}>
            ← Voltar
          </button>
            <hr />
          <h1 className="pageTitle">Gestão de Estoque</h1>
        </div>

          <button className="logoutButton">Sair</button>

      </header>

      {/* ================= CONTEÚDO ================= */}
      <main className="gestaoContent">
        {/* Coluna esquerda */}
        <section className="leftColumn">
          <div className="movimentacaoCard">
            <div className="cardHeader Header">
              <h2>↗ Nova Movimentação</h2>
            </div>

            <form className="movimentacaoForm" onSubmit={registrarMovimentacao}>
              {/* Produto */}
              <div className="formGroup">
                <label>Produto *</label>
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
              </div>

              {/* Tipo de movimentação */}
              <div className="formGroup">
                <label>Tipo de Movimentação *</label>

                <div className="radioGroup">
                  <label className="radioItem">
                    <input
                      type="radio"
                      name="tipoMovimentacao"
                      value="entrada"
                      checked={tipoMovimentacao === "entrada"}
                      onChange={(e) => setTipoMovimentacao(e.target.value)}
                    />
                    <span className="entradaText">↗ Entrada</span>
                  </label>

                  <label className="radioItem">
                    <input
                      type="radio"
                      name="tipoMovimentacao"
                      value="saida"
                      checked={tipoMovimentacao === "saida"}
                      onChange={(e) => setTipoMovimentacao(e.target.value)}
                    />
                    <span className="saidaText">↘ Saída</span>
                  </label>
                </div>
              </div>

              {/* Quantidade */}
              <div className="formGroup">
                <label>Quantidade *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>

              {/* Data */}
              <div className="formGroup">
                <label>Data da Movimentação *</label>
                <input
                  type="date"
                  value={dataMovimentacao}
                  onChange={(e) => setDataMovimentacao(e.target.value)}
                />
              </div>

              <button type="submit" className="registrarButton">
                Registrar Movimentação
              </button>
            </form>

            {/* Mensagens */}
            {mensagem && <p className="mensagemBox">{mensagem}</p>}
            {alerta && <p className="alertaBox">{alerta}</p>}
          </div>
        </section>

        {/* Coluna direita */}
        <section className="rightColumn">
          {/* Alerta superior */}
          {produtosAbaixoDoMinimo.length > 0 && (
            <div className="warningCard">
                <h3>⚠ Atenção!</h3>

                <p>
                {produtosAbaixoDoMinimo.length} produto(s) com estoque abaixo do mínimo:
                </p>

                <ul className="warningList">
                {produtosAbaixoDoMinimo.map((produto) => (
                    <li key={produto.idProduto}>{produto.nome}</li>
                ))}
                </ul>
            </div>
            )}

          {/* Card da tabela */}
          <div className="produtosCard">
            <div className="produtosHeader">
              <h2>📦 Produtos (Ordenação Alfabética)</h2>
            </div>

            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Estoque Atual</th>
                    <th>Estoque Mínimo</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {produtos.length > 0 ? (
                    produtos.map((produto) => {
                      const abaixoDoMinimo =
                        Number(produto.quantidadeAtual) <
                        Number(produto.quantidadeMinima);

                      return (
                        <tr
                          key={produto.idProduto}
                          className={abaixoDoMinimo ? "linhaAlerta" : ""}
                        >
                          <td>
                            <div className="produtoNome">{produto.nome}</div>
                            <div className="produtoDescricao">
                              {produto.descricao}
                            </div>
                          </td>

                          <td className={abaixoDoMinimo ? "valorBaixo" : ""}>
                            {produto.quantidadeAtual}
                          </td>

                          <td>{produto.quantidadeMinima}</td>

                          <td>
                            {abaixoDoMinimo ? (
                              <span className="statusBadge statusBaixo">
                                △ Baixo
                              </span>
                            ) : (
                              <span className="statusBadge statusOk">OK</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="semDados">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}