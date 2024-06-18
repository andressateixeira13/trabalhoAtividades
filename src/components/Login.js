import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Login = () => {
    const [cpf, setCPF] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para autenticação
        // Exemplo simplificado:
        if (cpf === 'admin' && senha === 'admin') {
            navigate('/atividades');
        } else {
            alert('Credenciais inválidas!');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Login</h2>
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
