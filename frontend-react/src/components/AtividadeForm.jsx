import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AtividadeForm = () => {
    const navigate = useNavigate();

    const [nomeAtiv, setNomeAtiv] = useState('');
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
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
                    axios.get('http://localhost:8080/ambiente', config)
                ]);

                console.log("Tipos de Atividade:", tipos.data);
                console.log("Funcionários:", funcs.data);
                console.log("Ambientes:", ambs.data);

                setTiposAtividade(tipos.data);
                setFuncionarios(funcs.data);
                setAmbientes(ambs.data);
            } catch (error) {
                alert("Erro ao carregar dados.");
                console.error(error);
            }
        };

        fetchDados();
    }, []);

    const handleCriarAtividade = async (e) => {
    e.preventDefault();

    const payload = {
        nomeAtiv,
        descricao,
        data,
        tipoAtividade: Number(tipoAtividade),
        funcionario: Number(funcionario),
        ambiente: Number(ambiente)
    };

    console.log("Enviando atividade:", payload);

    try {
        await axios.post('http://localhost:8080/atividades', payload, config);
        alert("Atividade criada com sucesso!");
        navigate('/atividades');
    } catch (error) {
        alert("Erro ao criar atividade. Verifique se você tem permissão.");
        console.error("Erro ao criar atividade:", error.response || error);
    }
};


    const handleAdicionarTipo = async () => {
        if (!novoTipo) return;
        try {
            const response = await axios.post('http://localhost:8080/tipoatividade', { nome: novoTipo }, config);
            console.log("Tipo criado:", response.data);
            setTiposAtividade([...tiposAtividade, response.data]);
            setTipoAtividade(response.data.id); 
            setNovoTipo('');
            setMostrarNovoTipo(false);
        } catch (error) {
            alert("Erro ao adicionar tipo.");
            console.error(error);
        }
    };

    const handleExcluirTipo = async (id) => {
        if (!window.confirm("Deseja realmente excluir este tipo?")) return;
        try {
            await axios.delete(`http://localhost:8080/tipoatividade/${id}`, config);
            setTiposAtividade(tiposAtividade.filter(t => t.id !== id));
        } catch (error) {
            alert("Erro ao excluir tipo.");
            console.error(error);
        }
    };

    const funcionariosFiltrados = funcionarios.filter(f =>
        f.nome.toLowerCase().includes(filtroFuncionario.toLowerCase())
    );

    return (
        <div className="container py-4 bg-light min-vh-100">
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
                    <label className="form-label">Data:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data}
                        onChange={e => setData(e.target.value)}
                        required
                    />
                </div>

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
                                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                            ))}
                        </select>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setMostrarNovoTipo(!mostrarNovoTipo)}>
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
                            <button type="button" className="btn btn-secondary" onClick={handleAdicionarTipo}>Salvar</button>
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Funcionário:</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Buscar funcionário"
                        value={filtroFuncionario}
                        onChange={e => setFiltroFuncionario(e.target.value)}
                    />
                    <select
                        className="form-select"
                        value={funcionario}
                        onChange={e => setFuncionario(e.target.value)}
                        required
                    >
                        <option value="">Selecione</option>
                        {funcionariosFiltrados.map(func => (
                            <option key={func.codFunc} value={func.codFunc}>{func.nome}</option>
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
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/ambientes')}>
                            Novo Ambiente
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn btn-dark w-100">Salvar Atividade</button>
            </form>
        </div>
    );
};

export default AtividadeForm;
