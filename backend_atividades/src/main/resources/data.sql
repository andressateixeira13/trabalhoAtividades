-- Criação da tabela de tipos de atividade
CREATE TABLE TipoAtividade (
                               codTipo SERIAL PRIMARY KEY,
                               nome VARCHAR(100) NOT NULL
);

-- Criação da tabela de ambientes
CREATE TABLE Ambiente (
                          codAmb SERIAL PRIMARY KEY,
                          rua VARCHAR(100) NOT NULL,
                          cep VARCHAR(20) NOT NULL,
                          bairro VARCHAR(50) NOT NULL,
                          numero VARCHAR(10) NOT NULL,
                          sala VARCHAR(20),
                          complemento VARCHAR(100),
                          predio VARCHAR(100),
                          setor VARCHAR(50)
);

-- Criação da tabela de funcionários
CREATE TABLE Funcionario (
                             codFunc SERIAL PRIMARY KEY,
                             nome VARCHAR(100) NOT NULL,
                             cpf VARCHAR(11) UNIQUE NOT NULL,
                             cargo VARCHAR(50) NOT NULL,
                             senha VARCHAR(255) NOT NULL,
                             setor VARCHAR(50) NOT NULL,
                             permissao VARCHAR(50) NOT NULL,
                             email VARCHAR(100) NOT NULL
);

-- Criação da tabela de atividades
CREATE TABLE Atividade (
                           codAtiv SERIAL PRIMARY KEY,
                           nomeAtiv VARCHAR(100) NOT NULL,
                           descricao TEXT,
                           data DATE,
                           situacao VARCHAR(50) NOT NULL,
                           descricaoSituacao TEXT,
                           foto BYTEA,
                           feedback TEXT,
                           recorrencia SERIAL,
                           codTipo INT NOT NULL,
                           codFunc INT NOT NULL,
                           codAmb INT,
                           CONSTRAINT fk_tipo_atividade FOREIGN KEY (codTipo) REFERENCES TipoAtividade (codTipo),
                           CONSTRAINT fk_funcionario FOREIGN KEY (codFunc) REFERENCES Funcionario (codFunc),
                           CONSTRAINT fk_ambiente FOREIGN KEY (codAmb) REFERENCES Ambiente (codAmb)
);

-- Indexes para melhorar a performance em consultas
CREATE INDEX idx_atividade_tipo ON Atividade (codTipo);
CREATE INDEX idx_atividade_funcionario ON Atividade (codFunc);
CREATE INDEX idx_atividade_ambiente ON Atividade (codAmb);
