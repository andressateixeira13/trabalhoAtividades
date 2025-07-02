import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AtividadeList = () => {
    const [atividades, setAtividades] = useState([]);
    const [dadosCompletos, setDadosCompletos] = useState([]);
    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = usuario?.permissao === 'ROLE_GESTOR'
                    ? 'http://localhost:8080/atividades'
                    : `http://localhost:8080/atividades/funcionario/${usuario?.cpf}`;

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const atividadesRaw = response.data;

                // Buscando dados detalhados de ambiente e funcionário
                const atividadesDetalhadas = await Promise.all(atividadesRaw.map(async (atv) => {
                    let ambiente = null;
                    let funcionario = null;

                    try {
                        const [ambResp, funcResp] = await Promise.all([
                            axios.get(`http://localhost:8080/ambiente/${atv.ambiente}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            }),
                            axios.get(`http://localhost:8080/funcionarios/funcionario/${atv.funcionario}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            }),
                        ]);

                        ambiente = ambResp.data;
                        funcionario = funcResp.data;

                    } catch (err) {
                        console.warn("Erro ao buscar ambiente ou funcionário:", err);
                    }

                    return {
                        ...atv,
                        ambiente,
                        funcionario
                    };
                }));

                setAtividades(atividadesDetalhadas);

            } catch (error) {
                console.error("Erro ao buscar atividades:", error);
                alert("Erro ao carregar atividades. Verifique seu login.");
            }
        };

        if (usuario && token) {
            fetchData();
        } else {
            console.warn("Dados do usuário ou token não encontrados.");
            navigate('/');
        }
    }, [usuario, token, navigate]);

    return (
        <div className="container py-4 bg-light min-vh-100">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-secondary">Olá, {usuario?.nome || 'Usuário'}!</h2>
                <button className="btn btn-outline-dark" onClick={handleLogout}>Sair</button>
            </header>

            {usuario?.permissao === 'ROLE_GESTOR' && (
                <div className="mb-4 d-flex gap-2 flex-wrap">
                    <button className="btn btn-secondary" onClick={() => navigate('/criaatividade')}>Criar Atividade</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/ambientes')}>Cadastrar Ambiente</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/funcionarios')}>Cadastrar Funcionários</button>
                </div>
            )}

            <h4 className="text-muted mb-3">
                {usuario?.permissao === 'ROLE_GESTOR' ? 'Todas as Atividades' : 'Minhas Atividades'}
            </h4>

            {atividades.length > 0 ? (
                <div className="row">
                    {atividades.map((atv) => (
                        <div key={atv.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm bg-white border-0 h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title text-dark">{atv.nomeAtiv}</h5>
                                    <p className="card-text"><strong>Descrição:</strong> {atv.descricao}</p>
                                    <p className="card-text"><strong>Data:</strong> {atv.data}</p>
                                    <p className="card-text">
                                        <strong>Ambiente:</strong> {atv.ambiente?.rua || 'Não encontrado'}
                                    </p>
                                    <p className="card-text">
                                        <strong>Funcionário:</strong> {atv.funcionario?.nome || 'Não encontrado'}
                                    </p>
                                    <div className="mt-auto">
                                        <button
                                            className="btn btn-outline-secondary w-100"
                                            onClick={() => navigate(`/atividade/${atv.id}`)}
                                        >
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted">Nenhuma atividade encontrada.</p>
            )}
        </div>
    );
};

export default AtividadeList;
