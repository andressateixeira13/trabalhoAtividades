import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [cpf, setCPF] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/login', { cpf, senha });

            if (response.status === 200 && response.data.token) {
                const { token, cpf } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("cpf", cpf);

                const userResponse = await axios.get(`http://localhost:8080/funcionarios/${cpf}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (userResponse.status === 200) {
                    const usuario = userResponse.data;
                    localStorage.setItem("usuario", JSON.stringify(usuario));
                    navigate('/atividades');
                } else {
                    setMensagem("Erro ao buscar dados do usuário.");
                }
            } else {
                setMensagem("Credenciais inválidas.");
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setMensagem("Erro ao fazer login. Verifique CPF e senha.");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow p-4" style={{ width: '100%', minWidth: '400px', minHeight: '400px', backgroundColor: '#f8f9fa' }}>
                <h2 className="text-center text-secondary mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label text-muted">CPF</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Digite seu CPF"
                            value={cpf}
                            onChange={(e) => setCPF(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-secondary w-100">Entrar</button>
                    {mensagem && <div className="alert alert-danger mt-3">{mensagem}</div>}
                </form>
            </div>
        </div>
    );
};

export default Login;
