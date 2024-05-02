CREATE TABLE IF NOT EXISTS mesa
(
    id_mesa TEXT NOT NULL PRIMARY KEY,
    numero_mesa INT NOT NULL,
    em_uso BOOL NOT NULL,
    mesa_suja BOOL NOT NULL
);