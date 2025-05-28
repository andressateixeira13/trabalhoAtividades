import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import EditFuncionario from './components/EditFuncionario';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Entrar</h1>
                <Routes>
                    <Route path="/" element={<Login />} />
                    {/* Passando os dados do gerente como props para o Register */}
                    <Route path="/register" element={<Register />} />
                    {/* Adicione um ID de exemplo para o funcionário a ser editado */}
                    <Route path="/editfuncionario/:id" element={<EditFuncionario />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
