import client from '../db';

export type Order = {
	id?: number;
	user_id: number;
	complete: boolean;
};

export type OrderProduct = {
	id?: number;
	quantity: number;
	order_id: number;
	product_id: number;
};

export class OrderModel {
	async index(): Promise<Order[]> {
		try {
			const connection = await client.connect();
			const sql =
				"SELECT o.id AS id, u.\"userName\" AS \"userName\", JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', op.quantity)) AS products, o.complete AS complete FROM orders AS o Left JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id GROUP BY o.id, u.\"userName\", o.complete";

			const queryResult = await connection.query(sql);

			connection.release();
			return queryResult.rows;
		} catch (err) {
			throw new Error(`Unable to retrieve orders: ${err}`);
		}
	}

	async show(id: number): Promise<Order> {
		try {
			const connection = await client.connect();
			const sql =
				"SELECT o.id AS id, u.\"userName\" AS \"userName\", JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', op.quantity)) AS products, o.complete AS complete FROM orders AS o Left JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.id = $1 GROUP BY o.id, u.\"userName\", o.complete";

			const queryResult = await connection.query(sql, [id]);

			connection.release();
			return queryResult.rows[0];
		} catch (err) {
			throw new Error(`unable to retrieve order: (${id}) ${err}`);
		}
	}

	async current(id: number): Promise<Order> {
		try {
			const connection = await client.connect();
			const sql =
				"SELECT o.id AS id, u.\"userName\" AS \"userName\", JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', op.quantity)) AS products, o.complete AS complete FROM orders AS o Left JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.user_id = $1 AND o.complete = false GROUP BY o.id, u.\"userName\", o.complete";

			const queryResult = await connection.query(sql, [id]);

			connection.release();
			return queryResult.rows[0];
		} catch (err) {
			throw new Error(`unable to retrieve order: (${id}) ${err}`);
		}
	}

	async create(order: Order): Promise<Order> {
		try {
			const connection = await client.connect();
			const sql =
				'INSERT INTO orders ("user_id", "complete") VALUES ($1, $2) RETURNING *';

			const queryResult = await connection.query(sql, [
				order.user_id,
				order.complete
			]);
			const firstOrder = queryResult.rows[0];

			connection.release();

			return firstOrder;
		} catch (err) {
			throw new Error(`Could not create order (${order.id}): ${err}`);
		}
	}

	async edit(order: Order): Promise<Order> {
		try {
			const connection = await client.connect();
			const sql =
				'UPDATE orders SET "user_id" = $1, "complete" = $2 WHERE "id" = $3 RETURNING *';

			const queryResult = await connection.query(sql, [
				order.user_id,
				order.complete,
				order.id
			]);
			const firstOrder = queryResult.rows[0];

			connection.release();

			return firstOrder;
		} catch (err) {
			throw new Error(`Could not edit order (${order.id}): ${err}`);
		}
	}

	async delete(id: number): Promise<Order> {
		try {
			const connection = await client.connect();
			const queryResult = await connection.query(
				'DELETE FROM orders WHERE "id"=$1 RETURNING *',
				[id]
			);
			const firstOrder = queryResult.rows[0];
			return firstOrder;
		} catch (err) {
			throw new Error(`Cannot delete user with id: (${id}) ${err}`);
		}
	}

	async indexOrderProduct(order_id: number): Promise<OrderProduct[]> {
		try {
			const connection = await client.connect();
			const sql =
				"SELECT o.id AS id, JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', op.quantity)) AS products FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id WHERE o.id = $1 GROUP BY o.id";
			const queryResult = await connection.query(sql, [order_id]);
			return queryResult.rows;
		} catch (err) {
			throw new Error(
				`Cannot retreive products in Order (${order_id}): ${err}`
			);
		}
	}

	async showOrderProduct(
		order_id: number,
		product_id: number
	): Promise<OrderProduct> {
		try {
			const connection = await client.connect();
			const sql =
				'SELECT op."order_id" AS id, op."quantity", p."name" AS product, p."price" AS price FROM order_products AS op JOIN products AS p ON p."id" = op."product_id" WHERE "order_id" = $1 AND "product_id" = $2';
			const queryResult = await connection.query(sql, [
				order_id,
				product_id
			]);
			return queryResult.rows[0];
		} catch (err) {
			throw new Error(
				`Cannot retreive Product (${product_id}) in Order (${order_id}): ${err}`
			);
		}
	}

	async addOrderProduct(orderProduct: OrderProduct): Promise<OrderProduct> {
		try {
			const connection = await client.connect();
			const queryResult = await connection.query(
				'INSERT INTO order_products ("quantity", "order_id", "product_id") VALUES ($1, $2, $3) RETURNING *',
				[
					orderProduct.quantity,
					orderProduct.order_id,
					orderProduct.product_id
				]
			);

			const firstOrderProduct = queryResult.rows[0];

			connection.release();

			return firstOrderProduct;
		} catch (err) {
			throw new Error(
				`Cannot add product id (${orderProduct.product_id}) to order id (${orderProduct.order_id}): ${err}`
			);
		}
	}

	async deleteOrderProduct(
		order_id: number,
		product_id: number
	): Promise<OrderProduct> {
		try {
			const connection = await client.connect();

			const queryResult = await connection.query(
				'DELETE FROM order_products WHERE "order_id"=$1 AND "product_id"=$2 RETURNING *',
				[order_id, product_id]
			);
			const orderProduct = queryResult.rows[0];

			connection.release();
			return orderProduct;
		} catch (err) {
			throw new Error(
				`Could not delete item (${product_id}) from Order (${order_id}): ${err}`
			);
		}
	}

	async editOrderProduct(orderProduct: OrderProduct): Promise<OrderProduct> {
		try {
			const connection = await client.connect();

			const queryResult = await connection.query(
				'UPDATE order_products SET "quantity" = $1, "order_id" = $2,  "product_id" = $3 WHERE "id" = $4 RETURNING *',
				[
					orderProduct.quantity,
					orderProduct.order_id,
					orderProduct.product_id,
					orderProduct.id
				]
			);

			const firstOrderProduct = queryResult.rows[0];

			connection.release();
			return firstOrderProduct;
		} catch (err) {
			throw new Error(
				`Could not update quantity of product (${orderProduct.product_id}) in order (${orderProduct.order_id}): ${err}`
			);
		}
	}
}
