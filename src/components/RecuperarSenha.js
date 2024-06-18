import React, { useState } from 'react';
import '../styles.css';

const RecuperarSenha = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para recuperar senha
        console.log(`Email para recuperação de senha enviado para: ${email}`);
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Recuperar Senha</h2>
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Recuperar Senha</button>
            </form>
        </div>
    );
};

export default RecuperarSenha;
