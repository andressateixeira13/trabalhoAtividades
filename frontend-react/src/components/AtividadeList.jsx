import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AtividadeList = () => {
    const [atividades, setAtividades] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState('feedback');
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
            navigate('/');
        }
    }, [usuario, token, navigate]);

    // Separar atividades por categorias
    const hoje = new Date().toISOString().split('T')[0];

    const aguardandoFeedback = atividades.filter(atv => atv.situacao);
    const pendentes = atividades.filter(atv => !atv.situacao && atv.data >= hoje);
    const atrasadas = atividades.filter(atv => !atv.situacao && atv.data < hoje);

    const renderCards = (atividadesFiltradas) => {
    if (!atividadesFiltradas || atividadesFiltradas.length === 0) {
        return <p className="text-muted">Nenhuma atividade nesta categoria.</p>;
    }

    return (
        <div className="row gx-4 gy-4">
            {atividadesFiltradas.map((atv) => (
                <div key={atv.id} className="col-12 col-md-6 col-lg-4 d-flex">
                    <div className="card shadow-sm w-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{atv.nomeAtiv}</h5>
                            <p><strong>Descrição:</strong> {atv.descricao}</p>
                            <p><strong>Data:</strong> {atv.data}</p>
                            <p><strong>Ambiente:</strong> {atv.ambiente?.rua || 'Desconhecido'}</p>
                            <p><strong>Funcionário:</strong> {atv.funcionario?.nome || 'Desconhecido'}</p>
                            <div className="mt-auto">
                                <button className="btn btn-outline-primary w-100" onClick={() => navigate(`/atividade/${atv.id}`)}>
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};



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

            <div className="d-flex gap-3 border-bottom mb-3">
                <button className={`btn ${abaAtiva === 'feedback' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setAbaAtiva('feedback')}>
                    Concluídas
                </button>
                <button className={`btn ${abaAtiva === 'pendentes' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setAbaAtiva('pendentes')}>
                    Pendentes
                </button>
                <button className={`btn ${abaAtiva === 'atrasadas' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setAbaAtiva('atrasadas')}>
                    Atrasadas
                </button>
            </div>

            {abaAtiva === 'feedback' && renderCards(aguardandoFeedback)}
            {abaAtiva === 'pendentes' && renderCards(pendentes)}
            {abaAtiva === 'atrasadas' && renderCards(atrasadas)}
        </div>
    );
};

export default AtividadeList;
