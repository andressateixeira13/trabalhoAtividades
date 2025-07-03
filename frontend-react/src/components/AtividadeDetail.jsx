import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

const AtividadeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [atividade, setAtividade] = useState(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [formData, setFormData] = useState({});
    const [feedback, setFeedback] = useState('');
    const [status, setStatus] = useState('');
    const [descricaoRetorno, setDescricaoRetorno] = useState('');

    const [tiposAtividade, setTiposAtividade] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [ambientes, setAmbientes] = useState([]);

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    
    useEffect(() => {
        const fetchDados = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/atividades/${id}`, config);
                const atividadeData = response.data;

                const [tiposResp, funcsResp, ambsResp] = await Promise.all([
                    axios.get('http://localhost:8080/tipoatividade', config),
                    axios.get('http://localhost:8080/funcionarios/list', config),
                    axios.get('http://localhost:8080/ambiente/list', config)
                ]);

                const funcionariosFiltrados = funcsResp.data.filter(f => f.permissao === 'ROLE_FUNCIONARIO');

                setTiposAtividade(tiposResp.data);
                setFuncionarios(funcionariosFiltrados);
                setAmbientes(ambsResp.data);

                const tipoSelecionado = tiposResp.data.find(t => t.codTipo === atividadeData.tipoAtividade);
                const funcionarioSelecionado = funcionariosFiltrados.find(f => f.cod === atividadeData.funcionario);
                const ambienteSelecionado = ambsResp.data.find(a => a.codAmb === atividadeData.ambiente);

                const atividadeCompleta = {
                    ...atividadeData,
                    tipoAtividade: tipoSelecionado || null,
                    funcionario: funcionarioSelecionado || null,
                    ambiente: ambienteSelecionado || null
                };

                setAtividade(atividadeCompleta);
                setFormData(atividadeCompleta);

                if (atividadeData.feedback) {
                    setFeedback(atividadeData.feedback);
                }

                if (atividadeData.retorno) {
                    setStatus(atividadeData.retorno.situacao);
                    setDescricaoRetorno(atividadeData.retorno.descricaoSituacao);
                }
            } catch (error) {
                console.error(`Erro ao carregar atividade ${id}:`, error);
            }
        };

        fetchDados();
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;

        if (name === 'tipoAtividade') {
            const selecionado = tiposAtividade.find(t => t.codTipo === Number(value)) || null;
            setFormData(prev => ({ ...prev, tipoAtividade: selecionado }));
        } else if (name === 'funcionario') {
            const selecionado = funcionarios.find(f => f.cod === Number(value)) || null;
            setFormData(prev => ({ ...prev, funcionario: selecionado }));
        } else if (name === 'ambiente') {
            const selecionado = ambientes.find(a => a.codAmb === Number(value)) || null;
            setFormData(prev => ({ ...prev, ambiente: selecionado }));
        }
    };

    const handleSalvarAlteracoes = async () => {
        try {
            const dadosParaEnviar = {
                ...formData,
                tipoAtividade: formData.tipoAtividade?.codTipo,
                funcionario: formData.funcionario?.cod,
                ambiente: formData.ambiente?.codAmb,
            };

            await axios.put(`http://localhost:8080/atividades/atualizar/${id}`, dadosParaEnviar, config);

            alert('Atividade atualizada com sucesso!');
            setModoEdicao(false);
            setAtividade(formData);
        } catch (error) {
            console.error('Erro ao atualizar atividade:', error);
            alert('Erro ao salvar alterações.');
        }
    };


    const handleExcluir = async () => {
        const confirm = window.confirm('Tem certeza que deseja excluir esta atividade?');
        if (!confirm) return;
        try {
            await axios.delete(`http://localhost:8080/atividades/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Atividade excluída com sucesso.');
            navigate('/atividades');
        } catch (error) {
            console.error('Erro ao excluir atividade:', error);
        }
    };

    const handleEnviarFeedback = async () => {
        try {
            await axios.put(`http://localhost:8080/atividades/${id}/feedback`, { feedback }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Feedback enviado com sucesso!');
            setFeedback('');
        } catch (error) {
            console.error('Erro ao enviar feedback:', error);
        }
    };

    const handleEnviarRetorno = async () => {
        try {
            await axios.put(`http://localhost:8080/atividades/${id}/retorno`, {
                situacao: status,
                descricao: descricaoRetorno
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Retorno enviado com sucesso!');
            setStatus('');
            setDescricaoRetorno('');
        } catch (error) {
            console.error('Erro ao enviar retorno:', error);
        }
    };

    if (!atividade) {
        return <div className="container text-center py-5 text-secondary">Carregando...</div>;
    }

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-start mb-3">
                <button className="btn btn-outline-secondary" onClick={() => navigate('/atividades')}>
                Voltar
                </button>
            </div>

            <div className="card bg-light text-dark shadow">
                <div className="card-body">
                    <h3 className="card-title mb-4">Detalhes da Atividade</h3>

                    {modoEdicao ? (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Nome</label>
                                <input
                                    className="form-control"
                                    name="nomeAtiv"
                                    value={formData.nomeAtiv || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Descrição</label>
                                <textarea
                                    className="form-control"
                                    name="descricao"
                                    value={formData.descricao || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Data</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    name="data"
                                    value={formData.data || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Select Tipo Atividade */}
                            <div className="mb-3">
                                <label className="form-label">Tipo de Atividade</label>
                                <select
                                    className="form-select"
                                    name="tipoAtividade"
                                    value={formData.tipoAtividade?.codTipo || ''}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    {tiposAtividade.map(tipo => (
                                        <option key={tipo.codTipo} value={tipo.codTipo}>
                                            {tipo.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Select Funcionário */}
                            <div className="mb-3">
                                <label className="form-label">Funcionário</label>
                                <select
                                    className="form-select"
                                    name="funcionario"
                                    value={formData.funcionario?.cod || ''}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    {funcionarios.map(func => (
                                        <option key={func.cod} value={func.cod}>
                                            {func.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Select Ambiente */}
                            <div className="mb-3">
                                <label className="form-label">Ambiente</label>
                                <select
                                    className="form-select"
                                    name="ambiente"
                                    value={formData.ambiente?.codAmb || ''}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    {ambientes.map(amb => (
                                        <option key={amb.codAmb} value={amb.codAmb}>
                                            {amb.rua}, {amb.numero} - 
                                            {amb.setor} - Sala: {amb.sala}, Prédio: {amb.predio}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button className="btn btn-success me-2" onClick={handleSalvarAlteracoes}>
                                Salvar
                            </button>
                            <button className="btn btn-secondary" onClick={() => setModoEdicao(false)}>
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <p><strong>Nome:</strong> {atividade.nomeAtiv}</p>
                            <p><strong>Descrição:</strong> {atividade.descricao}</p>
                            <p><strong>Data:</strong> {atividade.data}</p>
                            <p><strong>Tipo de Atividade:</strong> {atividade.tipoAtividade?.nome}</p>
                            <p><strong>Funcionário:</strong> {atividade.funcionario?.nome}</p>
                            <p><strong>Ambiente:</strong> {atividade.ambiente?.rua}, {atividade.ambiente?.numero}</p>
                        </>
                    )}
                </div>
            </div>

            {usuario?.permissao === 'ROLE_GESTOR' && (
                <div className="mt-4">
                    {atividade?.retorno && (
                        <div className="card bg-white p-3 mb-4 border border-secondary">
                            <h5 className="text-secondary">Retorno do Funcionário</h5>
                            <p><strong>Status:</strong> {atividade.retorno.situacao}</p>
                            <p><strong>Descrição:</strong> {atividade.retorno.descricao}</p>
                        </div>
                    )}

                    {!modoEdicao && (
                        <button className="btn btn-warning me-2" onClick={() => setModoEdicao(true)}>Editar</button>
                    )}
                    <button className="btn btn-danger" onClick={handleExcluir}>Excluir</button>

                
                        <div className="mt-4 card bg-light p-3">
                            <h5>{feedback ? 'Editar Feedback' : 'Adicionar Feedback'}</h5>
                            <textarea
                                className="form-control mb-2"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Digite o feedback"
                                rows={3}
                            />
                            <button className="btn btn-primary" onClick={handleEnviarFeedback}>
                                {feedback ? 'Atualizar Feedback' : 'Enviar Feedback'}
                            </button>
                        </div>
                    
                </div>
            )}



            {usuario?.permissao === 'ROLE_FUNCIONARIO' && (
                <div className="mt-4 card bg-light p-3">
                    <h5>{status || descricaoRetorno ? 'Editar Retorno' : 'Registrar Retorno'}</h5>
                    <select className="form-select mb-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Selecione o status</option>
                        <option value="REALIZADA">REALIZADA</option>
                        <option value="NAO_REALIZADA">NÃO REALIZADA</option>
                        <option value="PENDENTE">PENDENTE</option>
                    </select>
                    <textarea
                        className="form-control mb-2"
                        value={descricaoRetorno}
                        onChange={(e) => setDescricaoRetorno(e.target.value)}
                        placeholder="Descrição do retorno"
                        rows={3}
                    />
                    <button className="btn btn-primary" onClick={handleEnviarRetorno}>
                        {status || descricaoRetorno ? 'Atualizar Retorno' : 'Enviar Retorno'}
                    </button>
                </div>
            )}

        </div>
    );
};

export default AtividadeDetail;
