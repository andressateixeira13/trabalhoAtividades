import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles.css';

const Register = () => {
    const [nome, setNome] = useState('');
    const [cpf, setCPF] = useState('');
    const [cargo, setCargo] = useState('');
    const [setor, setSetor] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const funcionarioData = {
            nome,
            cpf,
            cargo,
            setor
        };

        try {
            await api.post('/funcionarios', funcionarioData);
            navigate.push('/funcionarios/cadastrar');
        } catch (error) {
            console.error('Erro ao registrar funcionário:', error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Registrar Novo Funcionário</h2>
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCPF(e.target.value)} required />
                <input type="text" placeholder="Cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} required />
                <input type="text" placeholder="Setor" value={setor} onChange={(e) => setSetor(e.target.value)} required />

                <button type="submit">Registrar Funcionário</button>
            </form>
        </div>
    );
};

export default Register;
