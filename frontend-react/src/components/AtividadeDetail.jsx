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
    const fetchAtividade = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/atividades/${id}`, config);
            const atividadeData = response.data;

            const [tipos, funcs, ambs] = await Promise.all([
                axios.get('http://localhost:8080/tipoatividade', config),
                axios.get('http://localhost:8080/funcionarios/list', config),
                axios.get('http://localhost:8080/ambiente/list', config)
            ]);

            const tipo = tipos.data.find(t => t.id === atividadeData.tipoAtividade || t.codTipo === atividadeData.tipoAtividade);
            const func = funcs.data.find(f => f.codFunc === atividadeData.funcionario || f.cod === atividadeData.funcionario);
            const amb = ambs.data.find(a => a.codAmb === atividadeData.ambiente);

            setTiposAtividade(tipos.data);
            setFuncionarios(funcs.data.filter(f => f.permissao === 'ROLE_FUNCIONARIO'));
            setAmbientes(ambs.data);

            const atividadeCompleta = {
                ...atividadeData,
                data: atividadeData.data?.split('T')[0], 
                tipoAtividade: tipo || null,
                funcionario: func || null,
                ambiente: amb || null,
                nomeAtiv: atividadeData.nomeAtiv || '',
                descricao: atividadeData.descricao || ''
            };

            setAtividade(atividadeCompleta);
            setFormData(atividadeCompleta);
            setFeedback(atividadeCompleta.feedback || '');
        } catch (error) {
            console.error('Erro ao carregar dados da atividade:', error);
        }
    };

    fetchAtividade();
}, [id]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        if (name === 'tipoAtividade') {
            const tipo = tiposAtividade.find(t => t.id === Number(value) || t.codTipo === Number(value));
            setFormData(prev => ({ ...prev, tipoAtividade: tipo }));
        }
        if (name === 'funcionario') {
            const func = funcionarios.find(f => f.codFunc === Number(value) || f.cod === Number(value));
            setFormData(prev => ({ ...prev, funcionario: func }));
        }
        if (name === 'ambiente') {
            const amb = ambientes.find(a => a.codAmb === Number(value));
            setFormData(prev => ({ ...prev, ambiente: amb }));
        }
    };

    const handleSalvarAlteracoes = async () => {
        try {
            const payload = {
                ...formData,
                tipoAtividade: formData.tipoAtividade?.id || formData.tipoAtividade?.codTipo,
                funcionario: formData.funcionario?.codFunc || formData.funcionario?.cod,
                ambiente: formData.ambiente?.codAmb
            };

            await axios.put(`http://localhost:8080/atividades/${id}`, payload, config);
            alert('Atividade atualizada com sucesso!');
            setModoEdicao(false);
            setAtividade({ ...formData, ...payload });
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
        } catch (error) {
            console.error('Erro ao enviar feedback:', error);
        }
    };

    const handleEnviarRetorno = async () => {
        try {
            await axios.put(`http://localhost:8080/atividades/${id}/retorno`, {
                situacao: status,
                descricaoSituacao: descricaoRetorno
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

    const atraso = !atividade.situacao && new Date(atividade.data) < new Date();

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-start mb-3">
                <button className="btn btn-outline-primary" onClick={() => navigate('/atividades')}>
                    Voltar
                </button>
            </div>


            <div className="card bg-light shadow-sm">
                <div className="card-body">
                    <h4>Detalhes da Atividade</h4>

                    {modoEdicao ? (
                        <>
                            <div className="mb-3">
                                <label>Nome</label>
                                <input className="form-control" name="nomeAtiv" value={formData.nomeAtiv || ''} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label>Descrição</label>
                                <textarea className="form-control" name="descricao" value={formData.descricao || ''} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label>Data</label>
                                <input type="date" className="form-control" name="data" value={formData.data || ''} onChange={handleInputChange} />
                            </div>

                            <div className="mb-3">
                                <label>Tipo de Atividade</label>
                                <select className="form-select" value={formData.tipoAtividade?.id || formData.tipoAtividade?.codTipo || ''} onChange={e => handleSelectChange('tipoAtividade', e.target.value)}>
                                    <option value="">Selecione</option>
                                    {tiposAtividade.map(tipo => (
                                        <option key={tipo.id || tipo.codTipo} value={tipo.id || tipo.codTipo}>
                                            {tipo.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Funcionário</label>
                                <select className="form-select" value={formData.funcionario?.codFunc || formData.funcionario?.cod || ''} onChange={e => handleSelectChange('funcionario', e.target.value)}>
                                    <option value="">Selecione</option>
                                    {funcionarios.map(func => (
                                        <option key={func.codFunc || func.cod} value={func.codFunc || func.cod}>
                                            {func.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Ambiente</label>
                                <select className="form-select" value={formData.ambiente?.codAmb || ''} onChange={e => handleSelectChange('ambiente', e.target.value)}>
                                    <option value="">Selecione</option>
                                    {ambientes.map(amb => (
                                        <option key={amb.codAmb} value={amb.codAmb}>
                                            {amb.rua}, {amb.numero}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button className="btn btn-success me-2" onClick={handleSalvarAlteracoes}>Salvar</button>
                            <button className="btn btn-secondary" onClick={() => setModoEdicao(false)}>Cancelar</button>
                        </>
                    ) : (
                        <>
                            <p><strong>Nome:</strong> {atividade.nomeAtiv}</p>
                            <p><strong>Descrição:</strong> {atividade.descricao}</p>
                            <p><strong>Data:</strong> {atividade.data}</p>
                            <p><strong>Tipo:</strong> {atividade.tipoAtividade?.nome}</p>
                            <p><strong>Funcionário:</strong> {atividade.funcionario?.nome}</p>
                            <p><strong>Ambiente:</strong> {atividade.ambiente?.rua}, {atividade.ambiente?.numero}</p>
                        </>
                    )}
                </div>
            </div>

            {usuario?.permissao === 'ROLE_GESTOR' && (
                <div className="mt-4">
                    {!modoEdicao && (
                        <button className="btn btn-warning me-2" onClick={() => setModoEdicao(true)}>Editar</button>
                    )}
                    <button className="btn btn-danger" onClick={handleExcluir}>Excluir</button>

                    {atraso && (
                        <div className="alert alert-danger mt-4">
                            Atenção: a atividade está <strong>atrasada</strong>.
                        </div>
                    )}

                    {atividade.situacao && atividade.descricaoSituacao && (
                        <div className="card bg-success text-white p-3 mt-4">
                            <p><strong>Status:</strong> {atividade.situacao}</p>
                            <p><strong>Descrição:</strong> {atividade.descricaoSituacao}</p>
                        </div>
                    )}

                    {atividade.situacao && atividade.descricaoSituacao && (
                        <div className="mt-4 card bg-light p-3">
                            <h5>Feedback</h5>
                            <textarea
                                className="form-control mb-2"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                            />
                            {feedback !== atividade.feedback && (
                                <button className="btn btn-primary" onClick={handleEnviarFeedback}>Atualizar Feedback</button>
                            )}
                        </div>
                    )}

                    {!atividade.situacao && !atividade.descricaoSituacao && (
                        <div className="alert alert-warning mt-4">
                            Aguardando retorno do funcionário. O feedback só poderá ser enviado após o retorno.
                        </div>
                    )}
                </div>
            )}

            {usuario?.permissao === 'ROLE_FUNCIONARIO' && (
                <div className="mt-4 card bg-light p-3">
                    {atraso && (
                        <div className="alert alert-danger">
                            Atenção: a atividade está <strong>atrasada</strong>.
                        </div>
                    )}

                    {!atividade.situacao && !atividade.descricaoSituacao ? (
                        <>
                            <h5>Registrar Retorno</h5>
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
                            <button className="btn btn-primary" onClick={handleEnviarRetorno}>Enviar Retorno</button>
                        </>
                    ) : (
                        <div className="card bg-success text-white p-3">
                            <p><strong>Status:</strong> {atividade.situacao}</p>
                            <p><strong>Descrição:</strong> {atividade.descricaoSituacao}</p>
                        </div>
                    )}

                    {atividade.feedback && (
                        <div className="card bg-success text-white p-3 mt-4">
                            <p><strong>Feedback:</strong> {atividade.feedback}</p>
                        </div>
                    )}
                    {!atividade.feedback && (
                        <div className="alert alert-warning mt-4">
                            Aguardando Feedback.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AtividadeDetail;
