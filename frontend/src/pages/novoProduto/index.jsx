import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

export default function NovoProduto() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidadeAtual, setQuantidadeAtual] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  const [mensagem, setMensagem] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const voltar = () => {
    window.location.href = "/cadastro-produto";
  };

  const cadastrarProduto = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (
      !nome ||
      !tipo ||
      !descricao ||
      quantidadeAtual === "" ||
      quantidadeMinima === ""
    ) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/produtos/",
        {
          nome,
          tipo,
          descricao,
          quantidadeAtual: Number(quantidadeAtual),
          quantidadeMinima: Number(quantidadeMinima),
        },
        getAuthHeaders()
      );

      setMensagem("Produto cadastrado com sucesso.");

      setTimeout(() => {
        window.location.href = "/cadastro-produto";
      }, 1000);
    } catch (error) {
      console.log("Erro ao cadastrar produto:", error);
      setMensagem("Erro ao cadastrar produto.");
    }
  };

  return (
    <div className="novoProdutoPage">
      <header className="topBar">
        <div className="topLeft">
          <button className="backButton" onClick={voltar}>
            ← Voltar
          </button>

          <div className="titleDivider"></div>

          <h1 className="pageTitle">Novo Produto</h1>
        </div>

        <button className="logoutButton">Sair</button>
      </header>

      <main className="novoProdutoContent">
        <section className="formCard">
          <div className="formHeader">
            <h2>Cadastrar Produto</h2>
          </div>

          <form className="produtoForm" onSubmit={cadastrarProduto}>
            <div className="formGroup">
              <label>Nome *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome do produto"
              />
            </div>

            <div className="formGroup">
              <label>Tipo *</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Selecione um tipo</option>
                <option value="smartphones">Smartphones</option>
                <option value="notebooks">Notebooks</option>
                <option value="smart TVs">Smart TVs</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Descrição *</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite a descrição"
              />
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label>Estoque Atual *</label>
                <input
                  type="number"
                  value={quantidadeAtual}
                  onChange={(e) => setQuantidadeAtual(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="formGroup">
                <label>Estoque Mínimo *</label>
                <input
                  type="number"
                  value={quantidadeMinima}
                  onChange={(e) => setQuantidadeMinima(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {mensagem && <p className="mensagemBox">{mensagem}</p>}

            <div className="formActions">
              <button type="button" className="cancelButton" onClick={voltar}>
                Cancelar
              </button>

              <button type="submit" className="saveButton">
                Cadastrar Produto
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}