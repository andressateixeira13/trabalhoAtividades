import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const EditFuncionario = () => {
    const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    cpf: '',
    cargo: '',
    setor: ''
  });
  const [formEdit, setFormEdit] = useState({});
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

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

  const mostrarMensagem = (texto, tipo = 'sucesso') => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 4000);
  };

  const handleEditar = (func) => {
    setEditandoId(func.cod);
    setFormEdit({ ...func });
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setFormEdit({});
  };

  const handleSalvarEdicao = async (id) => {
    try {
      const permissao = formEdit.cargo === 'Gerente' ? 'ROLE_GESTOR' : 'ROLE_FUNCIONARIO';

      const dadosAtualizados = {
        ...formEdit,
        permissao,
        senha: '1234'
      };

      await axios.put(`http://localhost:8080/funcionarios/${id}`, dadosAtualizados, config);
      mostrarMensagem('Funcionário atualizado com sucesso!');
      setFormEdit({});
      setEditandoId(null);
      carregarFuncionarios();
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      mostrarMensagem('Erro ao salvar funcionário.', 'erro');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return;
    try {
      await axios.delete(`http://localhost:8080/funcionarios/${id}`, config);
      mostrarMensagem('Funcionário excluído com sucesso!');
      carregarFuncionarios();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      mostrarMensagem('Erro ao excluir funcionário.', 'erro');
    }
  };

  const handleAdicionar = async () => {
    try {
      const permissao = novoFuncionario.cargo === 'Gerente' ? 'ROLE_GESTOR' : 'ROLE_FUNCIONARIO';

      const dadosParaEnviar = {
        ...novoFuncionario,
        permissao,
        senha: '1234'
      };

      await axios.post('http://localhost:8080/funcionarios', dadosParaEnviar, config);
      mostrarMensagem('Funcionário adicionado com sucesso!');
      setNovoFuncionario({ nome: '', cpf: '', cargo: '', setor: '' });
      carregarFuncionarios();
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      mostrarMensagem('Erro ao adicionar funcionário.', 'erro');
    }
  };

  return (
    <div className="container mt-4">
        <div className="d-flex justify-content-start mb-3">
                <button className="btn btn-outline-primary" onClick={() => navigate('/atividades')}>
                    Voltar
                </button>
            </div>
      <h2 className="text-secondary mb-4">Gerenciar Funcionários</h2>

      {mensagem.texto && (
        <div className={`alert ${mensagem.tipo === 'erro' ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensagem.texto}
        </div>
      )}

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
            {funcionarios.map((func, index) => (
              <tr key={func.cod || index}>
                <td>
                  {editandoId === func.cod ? (
                    <input
                      className="form-control"
                      value={formEdit.nome || ''}
                      onChange={(e) => setFormEdit({ ...formEdit, nome: e.target.value })}
                    />
                  ) : (
                    func.nome
                  )}
                </td>
                <td>{func.cpf}</td>
                <td>
                  {editandoId === func.cod ? (
                    <input
                      className="form-control"
                      value={formEdit.cargo || ''}
                      onChange={(e) => setFormEdit({ ...formEdit, cargo: e.target.value })}
                    />
                  ) : (
                    func.cargo
                  )}
                </td>
                <td>
                  {editandoId === func.cod ? (
                    <input
                      className="form-control"
                      value={formEdit.setor || ''}
                      onChange={(e) => setFormEdit({ ...formEdit, setor: e.target.value })}
                    />
                  ) : (
                    func.setor
                  )}
                </td>
                <td>
                  {editandoId === func.cod ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => handleSalvarEdicao(func.cod)}>Salvar</button>
                      <button className="btn btn-secondary btn-sm" onClick={handleCancelarEdicao}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditar(func)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(func.cod)}>Excluir</button>
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

export default EditFuncionario;
