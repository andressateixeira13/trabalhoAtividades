import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles.css';

const AtividadeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nomeAtiv, setNomeAtiv] = useState('');
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
    const [tipoAtividade, setTipoAtividade] = useState('');
    const [funcionario, setFuncionario] = useState('');
    const [ambiente, setAmbiente] = useState('');

    const [tiposAtividade, setTiposAtividade] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [ambientes, setAmbientes] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDadosIniciais = async () => {
            try {
                const [tiposResponse, funcsResponse, ambsResponse] = await Promise.all([
                    api.get('/tipos-atividade'),
                    api.get('/funcionarios'),
                    api.get('/ambientes')
                ]);

                setTiposAtividade(tiposResponse.data);
                setFuncionarios(funcsResponse.data);
                setAmbientes(ambsResponse.data);

                if (id) {
                    const response = await api.get(`/atividades/${id}`);
                    const atividade = response.data;
                    setNomeAtiv(atividade.nomeAtiv);
                    setDescricao(atividade.descricao);
                    setData(atividade.data);
                    setTipoAtividade(atividade.tipoAtividade.id);
                    setFuncionario(atividade.funcionario.id);
                    setAmbiente(atividade.ambiente.id);
                }

                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        fetchDadosIniciais();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const atividadeData = {
            nomeAtiv,
            descricao,
            data,
            codTipo: tipoAtividade,
            codFunc: funcionario,
            codAmb: ambiente
        };

        try {
            if (id) {
                await api.put(`/atividades/${id}`, atividadeData);
            } else {
                await api.post('/atividades', atividadeData);
            }
            navigate('/atividades');
        } catch (error) {
            console.error('Erro ao salvar atividade:', error);
        }
    };

    if (loading) {
        return <div className="container">Carregando...</div>;
    }

    return (
        <div className="container">
            <div className="header">
                <h2>{id ? 'Editar Atividade' : 'Nova Atividade'}</h2>
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome da Atividade"
                    value={nomeAtiv}
                    onChange={(e) => setNomeAtiv(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />

                <div className="select-container">
                    <label>Tipo de Atividade:</label>
                    <select
                        value={tipoAtividade}
                        onChange={(e) => setTipoAtividade(e.target.value)}
                        required
                    >
                        <option value="">Selecione o Tipo</option>
                        {tiposAtividade.map(tipo => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="select-container">
                    <label>Funcionário:</label>
                    <select
                        value={funcionario}
                        onChange={(e) => setFuncionario(e.target.value)}
                        required
                    >
                        <option value="">Selecione o Funcionário</option>
                        {funcionarios.map(funcionario => (
                            <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="select-container">
                    <label>Ambiente:</label>
                    <select
                        value={ambiente}
                        onChange={(e) => setAmbiente(e.target.value)}
                        required
                    >
                        <option value="">Selecione o Ambiente</option>
                        {ambientes.map(ambiente => (
                            <option key={ambiente.id} value={ambiente.id}>
                                {ambiente.rua}, {ambiente.numero}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">{id ? 'Salvar Alterações' : 'Salvar'}</button>
            </form>
        </div>
    );
};

export default AtividadeForm;
