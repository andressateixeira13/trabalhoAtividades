import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles.css';

const AtividadeDetail = () => {
    const { id } = useParams();
    const [atividade, setAtividade] = useState(null);

    useEffect(() => {
        const fetchAtividade = async () => {
            try {
                const response = await api.get(`/atividades/${id}`);
                setAtividade(response.data);
            } catch (error) {
                console.error(`Erro ao carregar atividade ${id}:`, error);
            }
        };
        fetchAtividade();
    }, [id]);

    if (!atividade) {
        return <div className="container">Carregando...</div>;
    }

    return (
        <div className="container">
            <div className="header">
                <h2>Detalhes da Atividade</h2>
            </div>
            <div className="detail-container">
                <p>Nome da Atividade: {atividade.nomeAtiv}</p>
                <p>Descrição: {atividade.descricao}</p>
                <p>Data: {atividade.data}</p>
                <p>Tipo de Atividade: {atividade.tipoAtividade?.nome}</p>
                <p>Funcionário: {atividade.funcionario?.nome}</p>
                <p>Ambiente: {atividade.ambiente?.rua}, {atividade.ambiente?.numero}</p>
            </div>
            <Link to={`/atividades/${id}/editar`}>Editar Atividade</Link>
        </div>
    );
};

export default AtividadeDetail;
