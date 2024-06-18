import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles.css';

const EditFuncionario = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [cpf, setCPF] = useState('');
    const [cargo, setCargo] = useState('');
    const [setor, setSetor] = useState('');

    useEffect(() => {
        async function fetchFuncionario() {
            try {
                const response = await api.get(`/funcionarios/${id}`);
                const funcionario = response.data;
                setNome(funcionario.nome);
                setCPF(funcionario.cpf);
                setCargo(funcionario.cargo);
                setSetor(funcionario.setor);
            } catch (error) {
                console.error(`Erro ao carregar funcionário ${id}:`, error);
            }
        }

        fetchFuncionario();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const funcionarioData = {
            nome,
            cpf,
            cargo,
            setor
        };

        try {
            await api.put(`/funcionarios/${id}`, funcionarioData);
            navigate('/funcionarios');
        } catch (error) {
            console.error(`Erro ao editar funcionário ${id}:`, error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Editar Funcionário</h2>
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCPF(e.target.value)} required readOnly />
                <input type="text" placeholder="Cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} required />
                <input type="text" placeholder="Setor" value={setor} onChange={(e) => setSetor(e.target.value)} required />

                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditFuncionario;
