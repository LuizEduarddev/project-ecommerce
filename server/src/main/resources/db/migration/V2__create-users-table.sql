CREATE TABLE IF NOT EXISTS users
(
	id_user TEXT PRIMARY KEY NOT NULL,
	login_user TEXT NOT NULL,
	password_user TEXT NOT NULL,
	user_role TEXT,
	user_full_name TEXT,
	user_Telefone TEXT,
	user_cpf TEXT,
	user_endereco TEXT,
	user_email TEXT
);