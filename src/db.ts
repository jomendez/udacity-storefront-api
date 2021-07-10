import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

let connect;

const {
	POSTGRES_HOST,
	POSTGRES_DB,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	ENV,
	POSTGRES_DB_TEST
} = process.env;

let client;

if (!!ENV && ENV === 'dev') {
	connect = {
		host: POSTGRES_HOST,
		database: POSTGRES_DB,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD
	};
}

if (!!ENV && ENV === 'test') {
	connect = {
		host: POSTGRES_HOST,
		database: POSTGRES_DB_TEST,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD
	};
}

const pool = new Pool(connect);

pool.on('connect', () => {
	console.log(
		`${process.env.NODE_ENV} environment config loaded, db connection established`
	);
});

export default pool;
