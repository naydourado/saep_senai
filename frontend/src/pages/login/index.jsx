// src/pages/login/index.jsx
import React, { useState } from "react";
import axios from "axios";
import "./styles.css";
import Image from  '../../assets/rafiki.png';

export default function Login() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const logar = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username: user,
                password: password,
            });

            const access = response.data.access;

            localStorage.setItem("token", access);

            window.location.href = "/home";

        } catch (error) {
            console.log("Error: ", error);
            localStorage.removeItem("token");
            setMessage("Usuário ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loginPage">

            {/* Lado esquerdo da tela */}
            <div className="loginLeft">
                <img
                    className="loginIllustration"
                    src={Image}
                    alt="Ilustração de login"
                />
            </div>

            {/* Lado direito azul */}
            <div className="loginRight">

                {/* Card branco central */}
                <div className="loginCard">
                    <h1 className="loginTitle">Sistema de Estoque</h1>
                    <p className="loginSubtitle">Entre com suas credenciais para acessar o sistema</p>

                    <form className="loginForm" onSubmit={logar}>

                        {/* Campo usuário */}
                        <div className="inputWrapper">
                            <input
                                className="loginInput"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                placeholder="Nome de Usuário"
                                autoComplete="username"
                            />
                        </div>

                        {/* Campo senha */}
                        <div className="inputWrapper">
                            <input
                                className="loginInput"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Mensagem de erro */}
                        {message && <div className="loginError">{message}</div>}

                        {/* Botão login */}
                        <button className="loginButton" type="submit" disabled={loading}>
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>
                </div>

                {/* Círculos decorativos */}
                <div className="circleOne"></div>
                <div className="circleTwo"></div>
            </div>
        </div>
    );
}