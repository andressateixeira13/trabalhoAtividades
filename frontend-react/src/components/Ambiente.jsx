import React, { useState, useEffect } from 'react';
import axios from "axios"

const Ambiente = () => {
    const [ambientes, setAmbientes] = useState([]);
    const [rua, setRua] = useState('');
    const [cep, setCep] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [sala, setSala] = useState('');
    const [complemento, setComplemento] = useState('');
    const [predio, setPredio] = useState('');
    const [setor, setSetor] = useState('');

    const fetchAmbientes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/ambiente');
            setAmbientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar ambientes:', error);
        }
    };

    useEffect(() => {
        fetchAmbientes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const ambienteData = {
            rua,
            cep,
            bairro,
            numero,
            sala,
            complemento,
            predio,
            setor
        };

        try {
            await axios.post('http://localhost:8080/ambiente', ambienteData);
            fetchAmbientes();
            clearForm();
        } catch (error) {
            console.error('Erro ao criar ambiente:', error);
        }
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

    const deleteAmbiente = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/ambiente/${id}`);
            fetchAmbientes();
        } catch (error) {
            console.error(`Erro ao excluir ambiente ${id}:`, error);
        }
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4 text-secondary">Gerenciar Ambientes</h2>

            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm mb-5">
                <div className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rua"
                            value={rua}
                            onChange={(e) => setRua(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="CEP"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Bairro"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Número"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Sala"
                            value={sala}
                            onChange={(e) => setSala(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Complemento"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Prédio"
                            value={predio}
                            onChange={(e) => setPredio(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Setor"
                            value={setor}
                            onChange={(e) => setSetor(e.target.value)}
                            required
                        />
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
                    <div key={ambiente.id} className="col">
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
                                    onClick={() => deleteAmbiente(ambiente.id)}
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
