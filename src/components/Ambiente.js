import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles.css';

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

    const fetchAmbientes = async () => {
        try {
            const response = await api.get('/ambientes');
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
            await api.post('/ambientes', ambienteData);
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
            await api.delete(`/ambientes/${id}`);
            fetchAmbientes();
        } catch (error) {
            console.error(`Erro ao excluir ambiente ${id}:`, error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Gerenciar Ambientes</h2>
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
                <input type="text" placeholder="Rua" value={rua} onChange={(e) => setRua(e.target.value)} required />
                <input type="text" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} required />
                <input type="text" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
                <input type="text" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} required />
                <input type="text" placeholder="Sala" value={sala} onChange={(e) => setSala(e.target.value)} />
                <input type="text" placeholder="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                <input type="text" placeholder="Prédio" value={predio} onChange={(e) => setPredio(e.target.value)} />
                <input type="text" placeholder="Setor" value={setor} onChange={(e) => setSetor(e.target.value)} required />

                <button type="submit">Salvar Ambiente</button>
            </form>

            <div className="list-container">
                <h2>Ambientes Cadastrados</h2>
                {ambientes.map(ambiente => (
                    <div key={ambiente.id} className="list-item">
                        <p>{ambiente.rua}, {ambiente.numero}, {ambiente.bairro}</p>
                        <p>CEP: {ambiente.cep}</p>
                        <p>Sala: {ambiente.sala}</p>
                        <p>Complemento: {ambiente.complemento}</p>
                        <p>Prédio: {ambiente.predio}</p>
                        <p>Setor: {ambiente.setor}</p>
                        <button onClick={() => deleteAmbiente(ambiente.id)}>Excluir</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ambiente;
