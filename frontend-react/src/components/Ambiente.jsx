import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Ambiente = () => {
    const navigate = useNavigate();
    const [ambientes, setAmbientes] = useState([]);
    const [rua, setRua] = useState('');
    const [cep, setCep] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [sala, setSala] = useState('');
    const [complemento, setComplemento] = useState('');
    const [predio, setPredio] = useState('');
    const [setor, setSetor] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const mostrarMensagem = (texto, tipo = 'sucesso') => {
        setMensagem({ texto, tipo });
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 4000);
    };

    const clearForm = () => {
        setRua('');
        setCep('');
        setBairro('');
        setNumero('');
        setSala('');
        setComplemento('');
        setPredio('');
        setSetor('');
    };

    const fetchAmbientes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/ambiente', config);
            setAmbientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar ambientes:', error);
            mostrarMensagem('Erro ao carregar ambientes.', 'erro');
        }
    };

    useEffect(() => {
        fetchAmbientes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ambienteData = { rua, cep, bairro, numero, sala, complemento, predio, setor };

        try {
            await axios.post('http://localhost:8080/ambiente', ambienteData, config);
            fetchAmbientes();
            clearForm();
            mostrarMensagem('Ambiente cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar ambiente:', error);
            mostrarMensagem('Erro ao cadastrar ambiente.', 'erro');
        }
    };

    const deleteAmbiente = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/ambiente/${id}`, config);
            fetchAmbientes();
            mostrarMensagem('Ambiente excluído com sucesso!');
        } catch (error) {
            console.error(`Erro ao excluir ambiente ${id}:`, error);
            mostrarMensagem('Erro ao excluir ambiente.', 'erro');
        }
    };

    return (
        <div className="container my-4">

            <div className="d-flex justify-content-start mb-3">
                <button className="btn btn-outline-secondary" onClick={() => navigate('/atividades')}>
                    Voltar
                </button>
            </div>

            <h2 className="mb-4 text-secondary">Gerenciar Ambientes</h2>

            {mensagem.texto && (
                <div className={`alert ${mensagem.tipo === 'erro' ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {mensagem.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm mb-5">
                <div className="row g-3">
                    {/* campos de formulário */}
                    <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Rua" value={rua} onChange={(e) => setRua(e.target.value)} required />
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} required />
                    </div>
                    <div className="col-md-3">
                        <input type="text" className="form-control" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
                    </div>
                    <div className="col-md-1">
                        <input type="text" className="form-control" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} required />
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control" placeholder="Sala" value={sala} onChange={(e) => setSala(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <input type="text" className="form-control" placeholder="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <input type="text" className="form-control" placeholder="Prédio" value={predio} onChange={(e) => setPredio(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <input type="text" className="form-control" placeholder="Setor" value={setor} onChange={(e) => setSetor(e.target.value)} required />
                    </div>
                </div>

                <div className="mt-4">
                    <button type="submit" className="btn btn-dark">
                        Salvar Ambiente
                    </button>
                </div>
            </form>

            <h3 className="mb-3 text-secondary">Ambientes Cadastrados</h3>

            <div className="row row-cols-1 row-cols-md-2 g-4">
                {ambientes.length === 0 && (
                    <p className="text-muted">Nenhum ambiente cadastrado.</p>
                )}
                {ambientes.map((ambiente) => (
                    <div key={ambiente.codAmb} className="col">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title text-dark">
                                    {ambiente.rua}, {ambiente.numero} - {ambiente.bairro}
                                </h5>
                                <p className="card-text mb-1"><strong>CEP:</strong> {ambiente.cep}</p>
                                {ambiente.sala && <p className="card-text mb-1"><strong>Sala:</strong> {ambiente.sala}</p>}
                                {ambiente.complemento && <p className="card-text mb-1"><strong>Complemento:</strong> {ambiente.complemento}</p>}
                                {ambiente.predio && <p className="card-text mb-1"><strong>Prédio:</strong> {ambiente.predio}</p>}
                                <p className="card-text"><strong>Setor:</strong> {ambiente.setor}</p>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteAmbiente(ambiente.codAmb)}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ambiente;
