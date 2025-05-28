import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import axios from 'axios';

const Login = () => {
    const [cpf, setCPF] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/login', { cpf, senha });
            if (response.status === 200) {
                navigate('/register');
            } else {
                alert('Credenciais inválidas!');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Entrar</h2>
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
                <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCPF(e.target.value)} required />
                <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
