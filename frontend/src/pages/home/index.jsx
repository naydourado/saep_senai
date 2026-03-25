// src/pages/home/index.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sair from '../../assets/sair.png';
import "./styles.css";

export default function Home() {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarUsuario();
    }, []);

    const carregarUsuario = async () => {
        try {
            // Pega o token salvo no navegador
            const token = localStorage.getItem("token");

            // Se não tiver token, volta para login
            if (!token) {
                window.location.href = "/";
                return;
            }

            // Busca os dados do usuário logado
            const response = await axios.get("http://127.0.0.1:8000/api/usuarios/me/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Guarda o nome do usuário
            setUsername(response.data.username);
        } catch (error) {
            console.log("Erro ao carregar usuário: ", error);

            // Se der erro, remove o token e volta para login
            localStorage.removeItem("token");
            window.location.href = "/";
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Remove o token do navegador
        localStorage.removeItem("token");

        // Redireciona para a tela de login
        window.location.href = "/";
    };

    const irParaCadastroProduto = () => {
        // Redireciona para a tela de cadastro de produto
        window.location.href = "/cadastro-produto";
    };

    const irParaGestaoEstoque = () => {
        // Redireciona para a tela de gestão de estoque
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

            {/* Cabeçalho da página */}
            <header className="homeHeader">
                <div>
                    <h1 className="homeTitle">Sistema de Gerenciamento de Estoque</h1>
                </div>

                <div className="userArea">
                    <button className="logoutButton" onClick={logout}><img src={Sair} alt="Sair Icon" />
                        Sair
                    </button>
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="homeMain">

                {/* Card de boas-vindas */}
                <section className="welcomeCard">
                    <h2>Olá, {username}!</h2>
                    <p>
                        Escolha uma das opções abaixo para continuar utilizando o sistema.
                    </p>
                </section>

                {/* Área de acessos */}
                <section className="cardsArea">

                    {/* Card Cadastro de Produto */}
                    <div className="actionCard" onClick={irParaCadastroProduto}>
                        <h3>Cadastro de Produto</h3>
                        <p>Acesse a interface responsável pelo cadastro de novos produtos.</p>
                    </div>

                    {/* Card Gestão de Estoque */}
                    <div className="actionCard" onClick={irParaGestaoEstoque}>
                        <h3>Gestão de Estoque</h3>
                        <p>Acesse a interface de gestão e acompanhamento do estoque.</p>
                    </div>

                </section>
            </main>
        </div>
    );
}