import React, { useEffect, useState } from 'react';
import axios from "axios";

const FuncionarioManager = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [novoFuncionario, setNovoFuncionario] = useState({
        nome: '',
        cpf: '',
        cargo: '',
        setor: ''
    });
    const [formEdit, setFormEdit] = useState({});

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    const carregarFuncionarios = async () => {
        try {
            const response = await axios.get('http://localhost:8080/funcionarios/list', config);
            setFuncionarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
        }
    };

    const handleEditar = (func) => {
        setEditandoId(func.codFunc);
        setFormEdit({ ...func });
    };

    const handleSalvarEdicao = async () => {
        try {
            await axios.put(`http://localhost:8080/funcionarios/${editandoId}`, formEdit, config);
            alert('Funcionário atualizado!');
            setEditandoId(null);
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao salvar edição:', error);
            alert('Erro ao salvar.');
        }
    };

    const handleExcluir = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return;
        try {
            await axios.delete(`http://localhost:8080/funcionarios/${id}`, config);
            alert('Funcionário excluído!');
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
        }
    };

    const handleAdicionar = async () => {
        try {
            await axios.post('http://localhost:8080/funcionarios', novoFuncionario, config);
            alert('Funcionário adicionado!');
            setNovoFuncionario({ nome: '', cpf: '', cargo: '', setor: '' });
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao adicionar funcionário:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-secondary mb-4">Gerenciar Funcionários</h2>

            <div className="card bg-light mb-4">
                <div className="card-header bg-secondary text-white">Adicionar Novo Funcionário</div>
                <div className="card-body">
                    <div className="row g-2 mb-3">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nome"
                                value={novoFuncionario.nome}
                                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="CPF"
                                value={novoFuncionario.cpf}
                                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cpf: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cargo"
                                value={novoFuncionario.cargo}
                                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cargo: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Setor"
                                value={novoFuncionario.setor}
                                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, setor: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button className="btn btn-dark" onClick={handleAdicionar}>Adicionar</button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                    <thead className="table-secondary">
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Cargo</th>
                            <th>Setor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios.map((func) => (
                            <tr key={func.codFunc}>
                                <td>
                                    {editandoId === func.codFunc ? (
                                        <input
                                            className="form-control"
                                            value={formEdit.nome}
                                            onChange={(e) => setFormEdit({ ...formEdit, nome: e.target.value })}
                                        />
                                    ) : (
                                        func.nome
                                    )}
                                </td>
                                <td>{func.cpf}</td>
                                <td>
                                    {editandoId === func.codFunc ? (
                                        <input
                                            className="form-control"
                                            value={formEdit.cargo}
                                            onChange={(e) => setFormEdit({ ...formEdit, cargo: e.target.value })}
                                        />
                                    ) : (
                                        func.cargo
                                    )}
                                </td>
                                <td>
                                    {editandoId === func.codFunc ? (
                                        <input
                                            className="form-control"
                                            value={formEdit.setor}
                                            onChange={(e) => setFormEdit({ ...formEdit, setor: e.target.value })}
                                        />
                                    ) : (
                                        func.setor
                                    )}
                                </td>
                                <td>
                                    {editandoId === func.codFunc ? (
                                        <>
                                            <button className="btn btn-success btn-sm me-2" onClick={handleSalvarEdicao}>Salvar</button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => setEditandoId(null)}>Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditar(func)}>Editar</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(func.codFunc)}>Excluir</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FuncionarioManager;
