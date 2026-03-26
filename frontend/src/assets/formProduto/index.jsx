import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./styles.css";

export default function FormProduto() {
  const { id } = useParams();

  const editando = !!id;

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidadeAtual, setQuantidadeAtual] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (editando) {
      carregarProduto();
    }
  }, [id]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const carregarProduto = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/produtos/${id}/`,
        getAuthHeaders()
      );

      const produto = response.data;

      setNome(produto.nome || "");
      setTipo(produto.tipo || "");
      setDescricao(produto.descricao || "");
      setPreco(produto.preco ?? "");
      setQuantidadeAtual(produto.quantidadeAtual ?? "");
      setQuantidadeMinima(produto.quantidadeMinima ?? "");
    } catch (error) {
      console.log("Erro ao carregar produto:", error);
      setMensagem("Erro ao carregar produto.");
    }
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (
      !nome ||
      !tipo ||
      !descricao ||
      preco === "" ||
      quantidadeAtual === "" ||
      quantidadeMinima === ""
    ) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    const dadosProduto = {
      nome,
      tipo,
      descricao,
      preco: Number(preco),
      quantidadeAtual: Number(quantidadeAtual),
      quantidadeMinima: Number(quantidadeMinima),
    };

    try {
      if (editando) {
        await axios.put(
          `http://127.0.0.1:8000/api/produtos/${id}/`,
          dadosProduto,
          getAuthHeaders()
        );

        setMensagem("Produto atualizado com sucesso.");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/produtos/",
          dadosProduto,
          getAuthHeaders()
        );

        setMensagem("Produto cadastrado com sucesso.");

        setNome("");
        setTipo("");
        setDescricao("");
        setPreco("");
        setQuantidadeAtual("");
        setQuantidadeMinima("");
      }

      setTimeout(() => {
        window.location.href = "/cadastro-produto";
      }, 1000);
    } catch (error) {
      console.log("Erro ao salvar produto:", error);
      setMensagem("Erro ao salvar produto.");
    }
  };

  const voltar = () => {
    window.location.href = "/cadastro-produto";
  };

  return (
    <div className="formProdutoPage">
      <header className="topBar">
        <div className="topLeft">
          <button className="backButton" onClick={voltar}>
            ← Voltar
          </button>

          <div className="titleDivider"></div>

          <h1 className="pageTitle">
            {editando ? "Editar Produto" : "Novo Produto"}
          </h1>
        </div>

        <div className="topRight">
          <div className="userBadge">
            <span className="userIcon">◉</span>
            <span>Administrador</span>
          </div>

          <button className="logoutButton">Sair</button>
        </div>
      </header>

      <main className="formProdutoContent">
        <section className="formCard">
          <div className="formCardHeader">
            <h2>{editando ? "Editar Produto" : "Cadastrar Produto"}</h2>
          </div>

          <form className="produtoForm" onSubmit={salvarProduto}>
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
                <label>Preço *</label>
                <input
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="0.00"
                />
              </div>

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
              <button type="button" className="secondaryButton" onClick={voltar}>
                Cancelar
              </button>

              <button type="submit" className="primaryButton">
                {editando ? "Salvar Alterações" : "Cadastrar Produto"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}