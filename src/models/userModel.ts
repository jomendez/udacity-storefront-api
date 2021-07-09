import client from '../db';
import bcrypt from 'bcrypt';

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export type User = {
	id?: number;
	firstName: string;
	lastName: string;
	userName: string;
	password: string;
};

export class UserModel {
	async index(): Promise<User[]> {
		try {
			const connection = await client.connect();
			const sql = 'SELECT * FROM users';

			const result = await connection.query(sql);

			connection.release();

			return result.rows;
		} catch (err) {
			throw new Error(`Error while retrieving users: ${err}`);
		}
	}

	async show(id: number): Promise<User> {
		try {
			const connection = await client.connect();
			const sql = 'SELECT * FROM users WHERE "id"=$1';

			const result = await connection.query(sql, [id]);

			connection.release();

			const first =  result.rows[0];
      return first;
		} catch (err) {
			throw new Error(`Unable to retrieve user ${id}: ${err}`);
		}
	}

	async create(userObj: User): Promise<User> {
		try {
			const connection = await client.connect();
			const sql =
				'INSERT INTO users ("userName", "firstName", "lastName", "password") VALUES ($1, $2, $3, $4) RETURNING *';

			const hash = bcrypt.hashSync(
				userObj.password + pepper,
				parseInt(saltRounds as unknown as string)
			);

			const result = await connection.query(sql, [
				userObj.userName,
				userObj.firstName,
				userObj.lastName,
				hash
			]);
			const serultUser = result.rows[0];

			connection.release();

			return serultUser;
		} catch (err) {
			throw new Error(`Unable to create user (${userObj.userName}): ${err}`);
		}
	}

	async edit(userObj: User): Promise<User> {
		try {
			const connection = await client.connect();
			const sql =
				'UPDATE users SET "userName" = $1, "firstName" = $2, "lastName" = $3, "password" = $4 WHERE "id" = $5 RETURNING *';

			const hash = bcrypt.hashSync(
				userObj.password + pepper,
				parseInt(saltRounds as unknown as string)
			);

			const result = await connection.query(sql, [
				userObj.userName,
				userObj.firstName,
				userObj.lastName,
				hash,
				userObj.id,
			]);
			const first = result.rows[0];

			connection.release();

			return first;
		} catch (err) {
			throw new Error(`Unable to create user (${userObj.userName}): ${err}`);
		}
	}

	async delete(id: number): Promise<User> {
		try {
			const connection = await client.connect();
			const sql = 'DELETE FROM users WHERE "id"=$1 RETURNING *';

			const result = await connection.query(sql, [id]);

			const user = result.rows[0];

			connection.release();

			return user;
		} catch (err) {
			throw new Error(`Unable to delete user (${id}): ${err}`);
		}
	}

	async authenticate(
		userName: string,
		password: string
	): Promise<User | null> {
		const connection = await client.connect();
		const sql = 'SELECT "password" FROM users WHERE "userName"=$1';

		const result = await connection.query(sql, [userName]);

		if (result.rows.length) {
			const firstResultUser = result.rows[0];

			if (bcrypt.compareSync(password + pepper, firstResultUser.password)) {
				connection.release();
				return firstResultUser;
			}
		}
		throw new Error('Invalid username or Password');
	}
}