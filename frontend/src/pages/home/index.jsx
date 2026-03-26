import React, { useEffect, useState } from "react";
import axios from "axios";
import Sair from "../../assets/sair.png";
import User from "../../assets/iconUser.png";
import "./styles.css";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/api/usuarios/me/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsername(response.data.username);
    } catch (error) {
      console.log("Erro ao carregar usuário: ", error);
      localStorage.removeItem("token");
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const irParaCadastroProduto = () => {
    window.location.href = "/cadastro-produto";
  };

  const irParaGestaoEstoque = () => {
    window.location.href = "/gestao-estoque";
  };

  if (loading) {
    return (
      <div className="homeLoading">
        <p>Carregando...</p>
      </div>
    );
  }

return (
    <div className="homePage">
      {/* ================= CABEÇALHO ================= */}
      <header className="homeHeader">
        {/* Logo + nome do sistema */}
        <div className="brandArea">
          <div className="brandIcon">
            <span>▦</span>
          </div>
          <h1 className="homeTitle">Sistema de Estoque</h1>
        </div>

        {/* Área do usuário */}
        <div className="headerActions">
          <div className="userBadge">
            <img src={User} className="userBadgeIcon"/>
            <span>{username}</span>
          </div>

          <button className="logoutButton" onClick={logout}>
            <img src={Sair} alt="Ícone de sair" />
            Sair
          </button>
        </div>
      </header>

      {/* ================= CONTEÚDO PRINCIPAL ================= */}
      <main className="homeMain">
        {/* Seção de boas-vindas */}
        <section className="welcomeSection">
          <h2>
            Bem-vindo, {username}!
          </h2>
          <p>Selecione uma opção para começar a gerenciar seu estoque</p>
        </section>

        {/* Área dos cards principais */}
        <section className="cardsGrid">
          {/* Card Cadastro de Produtos */}
          <div
            className="featureCard featureCardPrimary"
            onClick={irParaCadastroProduto}
          >
            <div className="cardTop">
              <div className="cardIcon cardIconBlue">📦</div>

              <div>
                <h3>Cadastro de Produtos</h3>
                <p className="cardSubtitle">
                  Gerenciar, adicionar, editar e excluir produtos
                </p>
              </div>
            </div>

            <p className="cardText">
              Acesse a lista completa de produtos cadastrados no sistema. Você
              pode realizar buscas, adicionar novos produtos, editar informações
              existentes ou remover produtos do catálogo.
            </p>

            <div className="cardTags">
              <span className="tagItem">● CRUD Completo</span>
              <span className="tagItem">● Busca Avançada</span>
            </div>
          </div>

          {/* Card Gestão de Estoque */}
          <div className="featureCard" onClick={irParaGestaoEstoque}>
            <div className="cardTop">
              <div className="cardIcon cardIconGreen">↗</div>

              <div>
                <h3>Gestão de Estoque</h3>
                <p className="cardSubtitle">
                  Controlar entradas e saídas de produtos
                </p>
              </div>
            </div>

            <p className="cardText">
              Controle as movimentações de estoque realizando entradas e saídas
              de produtos. O sistema alerta automaticamente quando o estoque
              está abaixo do mínimo configurado.
            </p>

            <div className="cardTags">
              <span className="tagItem">● Alertas Automáticos</span>
              <span className="tagItem">● Controle em Tempo Real</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}