import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AtividadeForm = () => {
    const navigate = useNavigate();

    const [nomeAtiv, setNomeAtiv] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [frequencia, setFrequencia] = useState(''); 
    const [tipoAtividade, setTipoAtividade] = useState('');
    const [funcionario, setFuncionario] = useState('');
    const [ambiente, setAmbiente] = useState('');

    const [tiposAtividade, setTiposAtividade] = useState([]);
    const [novoTipo, setNovoTipo] = useState('');
    const [mostrarNovoTipo, setMostrarNovoTipo] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);
    const [ambientes, setAmbientes] = useState([]);
    const [filtroFuncionario, setFiltroFuncionario] = useState('');

    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario')); 
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        if (!token || !usuario) {
            alert("Usuário não autenticado.");
            navigate('/login');
            return;
        }

        if (usuario.permissao !== 'ROLE_GESTOR') {
            alert("Apenas gestores podem criar atividades.");
            navigate('/');
            return;
        }

        const fetchDados = async () => {
            try {
                const [tipos, funcs, ambs] = await Promise.all([
                    axios.get('http://localhost:8080/tipoatividade', config),
                    axios.get('http://localhost:8080/funcionarios/list', config),
                    axios.get('http://localhost:8080/ambiente/list', config)
                ]);

                setTiposAtividade(tipos.data);
                setFuncionarios(funcs.data.filter(f => f.permissao === 'ROLE_FUNCIONARIO'));
                setAmbientes(ambs.data);
            } catch (error) {
                alert("Erro ao carregar dados.");
                console.error(error);
            }
        };

        fetchDados();
    }, []);

    // Função para adicionar dias, semanas ou meses a uma data
    const adicionarData = (data, freq) => {
        const novaData = new Date(data);
        if (freq === 'diaria') {
            novaData.setDate(novaData.getDate() + 1);
        } else if (freq === 'semanal') {
            novaData.setDate(novaData.getDate() + 7);
        } else if (freq === 'mensal') {
            novaData.setMonth(novaData.getMonth() + 1);
        }
        return novaData;
    };

    const formatarData = (data) => {
        // Formata Date para yyyy-mm-dd
        return data.toISOString().split('T')[0];
    };

    const handleCriarAtividade = async (e) => {
        e.preventDefault();

        if (!dataInicio) {
            alert("Informe a data inicial.");
            return;
        }
        if (dataFim && dataFim < dataInicio) {
            alert("Data final deve ser igual ou maior que a inicial.");
            return;
        }
        if (dataFim && !frequencia) {
            alert("Informe a frequência para a recorrência.");
            return;
        }

        try {
            if (dataFim) {
                // Cria múltiplas atividades conforme recorrência
                let currentDate = new Date(dataInicio);
                const finalDate = new Date(dataFim);

                while (currentDate <= finalDate) {
                    const payload = {
                        nomeAtiv,
                        descricao,
                        data: formatarData(currentDate),
                        tipoAtividade: Number(tipoAtividade),
                        funcionario: Number(funcionario),
                        ambiente: Number(ambiente)
                    };
                    await axios.post('http://localhost:8080/atividades', payload, config);
                    currentDate = adicionarData(currentDate, frequencia);
                }
                alert("Atividades recorrentes criadas com sucesso!");
            } else {
                // Cria uma atividade simples
                const payload = {
                    nomeAtiv,
                    descricao,
                    data: dataInicio,
                    tipoAtividade: Number(tipoAtividade),
                    funcionario: Number(funcionario),
                    ambiente: Number(ambiente)
                };
                await axios.post('http://localhost:8080/atividades', payload, config);
                alert("Atividade criada com sucesso!");
            }
            navigate('/atividades');
        } catch (error) {
            alert("Erro ao criar atividade. Verifique os dados.");
            console.error("Erro ao criar atividade:", error.response || error);
        }
    };

    const handleAdicionarTipo = async () => {
        if (!novoTipo) return;
        try {
            const response = await axios.post('http://localhost:8080/tipoatividade', { nome: novoTipo }, config);
            setTiposAtividade([...tiposAtividade, response.data]);
            setTipoAtividade(response.data.codTipo);
            setNovoTipo('');
            setMostrarNovoTipo(false);
        } catch (error) {
            alert("Erro ao adicionar tipo.");
            console.error(error);
        }
    };

    const funcionariosFiltrados = funcionarios.filter(f =>
        f.nome.toLowerCase().includes(filtroFuncionario.toLowerCase())
    );

    return (
        <div className="container py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-start mb-3">
                <button className="btn btn-outline-primary" onClick={() => navigate('/atividades')}>
                    Voltar
                </button>
            </div>
            <h2 className="mb-4 text-secondary">Nova Atividade</h2>
            <form className="bg-white p-4 rounded shadow-sm" onSubmit={handleCriarAtividade}>
                <div className="mb-3">
                    <label className="form-label">Nome da Atividade:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nomeAtiv}
                        onChange={e => setNomeAtiv(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descrição:</label>
                    <textarea
                        className="form-control"
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Data Inicial:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dataInicio}
                        onChange={e => setDataInicio(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Data Final (opcional para recorrência):</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dataFim}
                        onChange={e => setDataFim(e.target.value)}
                        min={dataInicio}
                    />
                </div>

                {dataFim && (
                    <div className="mb-3">
                        <label className="form-label">Frequência de Repetição:</label>
                        <select
                            className="form-select"
                            value={frequencia}
                            onChange={e => setFrequencia(e.target.value)}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="diaria">Diária</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensal">Mensal</option>
                        </select>
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Tipo de Atividade:</label>
                    <div className="d-flex gap-2">
                        <select
                            className="form-select"
                            value={tipoAtividade}
                            onChange={e => setTipoAtividade(e.target.value)}
                            required
                        >
                            <option value="">Selecione</option>
                            {tiposAtividade.map(tipo => (
                                <option key={tipo.codTipo} value={tipo.codTipo}>
                                    {tipo.nome}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setMostrarNovoTipo(!mostrarNovoTipo)}
                        >
                            {mostrarNovoTipo ? 'Cancelar' : 'Novo Tipo'}
                        </button>
                    </div>

                    {mostrarNovoTipo && (
                        <div className="mt-3 d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Novo tipo"
                                value={novoTipo}
                                onChange={e => setNovoTipo(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleAdicionarTipo}
                            >
                                Salvar
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Funcionário:</label>
                    <select
                        className="form-select"
                        value={funcionario}
                        onChange={e => setFuncionario(e.target.value)}
                        required
                    >
                        <option value="">Selecione</option>
                        {funcionariosFiltrados.map(func => (
                            <option key={func.cod} value={func.cod}>
                                {func.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="form-label">Ambiente:</label>
                    <div className="d-flex gap-2">
                        <select
                            className="form-select"
                            value={ambiente}
                            onChange={e => setAmbiente(e.target.value)}
                            required
                        >
                            <option value="">Selecione</option>
                            {ambientes.map(amb => (
                                <option key={amb.codAmb} value={amb.codAmb}>
                                    {amb.rua}, {amb.numero}
                                </option>
                            ))}
                        </select>
                        
                    </div>
                </div>

                <button type="submit" className="btn btn-dark w-100">Salvar Atividade</button>
            </form>
        </div>
    );
};

export default AtividadeForm;
