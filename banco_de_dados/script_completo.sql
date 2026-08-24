CREATE TABLE IF NOT EXISTS status(
    id SERIAL PRIMARY KEY
    ,descricao VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS departamento(
    id SERIAL PRIMARY KEY
    ,descricao VARCHAR(20)
);


CREATE TABLE IF NOT EXISTS funcionario(
    id SERIAL PRIMARY KEY
    ,nome VARCHAR(80)
    ,email VARCHAR(150) UNIQUE
    ,telefone CHAR(11)
    ,cargo VARCHAR(80)
    ,cidade VARCHAR(80)
    ,salario NUMERIC(18,6)
    ,id_status INTEGER REFERENCES status(id)
    ,id_departamento INTEGER REFERENCES departamento(id)
);

INSERT INTO status(descricao) VALUES ('Em Análise'), ('Aprovado'),
                                     ('Reprovado'), ('Contratado');

INSERT INTO departamento(descricao) VALUES ('Tecnologia'), ('Infraestrutura')
                                         , ('Compliance'), ('Outro');