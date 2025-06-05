import { React, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Atividades from "./components/AtividadeList";
import CriaAtividade from "./components/AtividadeForm";
import DetalheAtividade from "./components/AtividadeDetail";
import Ambiente from "./components/Ambiente";
import Funcionario from "./components/EditFuncionario";
import "./App.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/funcionarios" element={<Funcionario/>}/>
      <Route path="/atividades" element={<Atividades/>}/>
      <Route path="/criaatividade" element={<CriaAtividade/>}/>
      <Route path="/atividade/:id" element={<DetalheAtividade/>}/>
      <Route path="/ambientes" element={<Ambiente/>}/>
    </Routes>
  )
}

export default App
