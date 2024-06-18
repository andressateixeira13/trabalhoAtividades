import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles.css';

const AtividadesList = () => {
    const [atividades, setAtividades] = useState([]);

    useEffect(() => {
        async function fetchAtividades() {
            try {
                const response = await api.get('/atividades');
                setAtividades(response.data);
            } catch (error) {
                console.error('Erro ao carregar atividades:', error);
            }
        }
        fetchAtividades();
    }, []);

    return (
        <div className="container">
            <div className="header">
                <h2>Lista de Atividades</h2>
            </div>
            <div className="list-container">
                {atividades.map(atividade => (
                    <div key={atividade.id} className="list-item">
                        <Link to={`/atividades/${atividade.id}`}>{atividade.nomeAtiv}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AtividadesList;
