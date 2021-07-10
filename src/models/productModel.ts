import client from '../db';

export type Product = {
	id?: number;
	name: string;
	price: number;
	category: string;
};

export class ProductModel {
	async index(): Promise<Product[]> {
		try {
			const connection = await client.connect();
			const sql = 'SELECT * FROM products';
			const result = await connection.query(sql);
			connection.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Unable to retrieve products: ${err}`);
		}
	}

	async show(id: number): Promise<Product> {
		try {
			const connection = await client.connect();
			const sql = 'SELECT * FROM products WHERE "id"=$1';

			const result = await connection.query(sql, [id]);

			connection.release();
			const first = result.rows[0];
			return first;
		} catch (err) {
			throw new Error(`Unable to retrieve product: ${err}`);
		}
	}

	async create(product: Product): Promise<Product> {
		try {
			const connection = await client.connect();
			const sql =
				'INSERT INTO products ("name", "price", "category") VALUES ($1, $2, $3) RETURNING *';

			const result = await connection.query(sql, [
				product.name,
				product.price,
				product.category
			]);

			const firstProduct = result.rows[0];
			connection.release();

			return firstProduct;
		} catch (err) {
			throw new Error(
				`Unable to create Product (${product.name}): ${err}`
			);
		}
	}

	async edit(product: Product): Promise<Product> {
		try {
			const connection = await client.connect();
			const sql =
				'UPDATE products SET "name" = $1, "price" = $2, "category" = $3 WHERE "id" = $4 RETURNING *';

			const result = await connection.query(sql, [
				product.name,
				product.price,
				product.category,
				product.id
			]);

			const firstProduct = result.rows[0];
			connection.release();

			return firstProduct;
		} catch (err) {
			throw new Error(`Unable to edit Product (${product.name}): ${err}`);
		}
	}

	async delete(id: number): Promise<Product> {
		try {
			const connection = await client.connect();
			const sql = 'DELETE FROM products WHERE "id"=$1 RETURNING *';
			const result = await connection.query(sql, [id]);
			const firstProduct = result.rows[0];
			connection.release();
			return firstProduct;
		} catch (err) {
			throw new Error(`Cannot Delete User with id: (${id}) ${err}`);
		}
	}
}
