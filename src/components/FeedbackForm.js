import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles.css';

const FeedbackForm = () => {
    const [situacao, setSituacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState('');
    const [atividade, setAtividade] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAtividades() {
            try {
                const response = await api.get('/atividades');
                setAtividade(response.data[0]?.id); // Seleciona a primeira atividade por padrão
            } catch (error) {
                console.error('Erro ao carregar atividades:', error);
            }
        }

        fetchAtividades();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('situacao', situacao);
        formData.append('descricao', descricao);
        formData.append('foto', foto);
        formData.append('codAtiv', atividade);

        try {
            await api.post('/feedback', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/atividades');
        } catch (error) {
            console.error('Erro ao enviar feedback:', error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Enviar Feedback</h2>
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
                <input type="text" placeholder="Situação" value={situacao} onChange={(e) => setSituacao(e.target.value)} required />
                <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                <input type="file" onChange={(e) => setFoto(e.target.files[0])} />

                <label>Atividade:</label>
                <select value={atividade} onChange={(e) => setAtividade(e.target.value)} required>
                    <option value="">Selecione a Atividade</option>
                    {/* Aqui deve vir uma lista de atividades */}
                </select>

                <button type="submit">Enviar Feedback</button>
            </form>
        </div>
    );
};

export default FeedbackForm;
