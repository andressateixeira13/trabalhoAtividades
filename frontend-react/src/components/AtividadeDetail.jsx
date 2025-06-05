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

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAtividade = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/atividades/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAtividade(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error(`Erro ao carregar atividade ${id}:`, error);
            }
        };
        fetchAtividade();
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSalvarAlteracoes = async () => {
        try {
            await axios.put(`http://localhost:8080/atividades/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            await axios.delete(`http://localhost:8080/atividades/${id}`, {
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
            await axios.post(`http://localhost:8080/atividades/${id}/feedback`, { feedback }, {
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
            await axios.post(`http://localhost:8080/atividades/${id}/retorno`, {
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
            <div className="card bg-light text-dark shadow">
                <div className="card-body">
                    <h3 className="card-title mb-4">Detalhes da Atividade</h3>

                    {modoEdicao ? (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Nome</label>
                                <input className="form-control" name="nomeAtiv" value={formData.nomeAtiv} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Descrição</label>
                                <textarea className="form-control" name="descricao" value={formData.descricao} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Data</label>
                                <input className="form-control" type="date" name="data" value={formData.data} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tipo Atividade</label>
                                <input className="form-control" value={formData.tipoAtividade?.nome || ''} onChange={(e) => setFormData(prev => ({ ...prev, tipoAtividade: { ...prev.tipoAtividade, nome: e.target.value } }))} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Funcionário</label>
                                <input className="form-control" value={formData.funcionario?.nome || ''} onChange={(e) => setFormData(prev => ({ ...prev, funcionario: { ...prev.funcionario, nome: e.target.value } }))} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Ambiente</label>
                                <input className="form-control" value={formData.ambiente?.rua || ''} onChange={(e) => setFormData(prev => ({ ...prev, ambiente: { ...prev.ambiente, rua: e.target.value } }))} />
                            </div>

                            <button className="btn btn-success me-2" onClick={handleSalvarAlteracoes}>Salvar</button>
                            <button className="btn btn-secondary" onClick={() => setModoEdicao(false)}>Cancelar</button>
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
                    {!modoEdicao && (
                        <button className="btn btn-warning me-2" onClick={() => setModoEdicao(true)}>Editar</button>
                    )}
                    <button className="btn btn-danger" onClick={handleExcluir}>Excluir</button>

                    <div className="mt-4 card bg-light p-3">
                        <h5>Adicionar Feedback</h5>
                        <textarea
                            className="form-control mb-2"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Digite o feedback"
                            rows={3}
                        />
                        <button className="btn btn-primary" onClick={handleEnviarFeedback}>Enviar Feedback</button>
                    </div>
                </div>
            )}

            {usuario?.permissao === 'ROLE_FUNCIONARIO' && (
                <div className="mt-4 card bg-light p-3">
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
                </div>
            )}
        </div>
    );
};

export default AtividadeDetail;
