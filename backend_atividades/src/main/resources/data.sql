-- Criação das tabelas
CREATE TABLE TipoAtividade (
                               codTipo SERIAL PRIMARY KEY,
                               nome VARCHAR(100) NOT NULL
);

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

CREATE TABLE Atividade (
                           codAtiv SERIAL PRIMARY KEY,
                           nomeAtiv VARCHAR(100) NOT NULL,
                           descricao TEXT,
                           data DATE NOT NULL,
                           codTipo INT NOT NULL,
                           codFunc INT NOT NULL,
                           codAmb INT NOT NULL,
                           CONSTRAINT fk_tipo_atividade FOREIGN KEY (codTipo) REFERENCES TipoAtividade (codTipo),
                           CONSTRAINT fk_funcionario FOREIGN KEY (codFunc) REFERENCES Funcionario (codFunc),
                           CONSTRAINT fk_ambiente FOREIGN KEY (codAmb) REFERENCES Ambiente (codAmb)
);

CREATE TABLE Retorno (
                         codRetorno SERIAL PRIMARY KEY,
                         situacao VARCHAR(50) NOT NULL,
                         descricao TEXT,
                         foto BYTEA,
                         codAtiv INT NOT NULL,
                         CONSTRAINT fk_atividade_retorno FOREIGN KEY (codAtiv) REFERENCES Atividade (codAtiv)
);

CREATE TABLE Feedback (
                          codFeedback SERIAL PRIMARY KEY,
                          descricao TEXT,
                          codAtiv INT NOT NULL,
                          CONSTRAINT fk_atividade_feedback FOREIGN KEY (codAtiv) REFERENCES Atividade (codAtiv)
);

-- Indexes para desempenho
CREATE INDEX idx_atividade_tipo ON Atividade (codTipo);
CREATE INDEX idx_atividade_funcionario ON Atividade (codFunc);
CREATE INDEX idx_atividade_ambiente ON Atividade (codAmb);
