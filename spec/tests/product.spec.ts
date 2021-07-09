import { ProductModel } from '../../src/models/productModel';
import { UserModel } from '../../src/models/userModel';
import supertest from 'supertest';
import app from '../../src/server';
import client from '../../src/db';
import { mockedUserObjectOne, mockedProductObjectOne, mockedProductObjectTwo, IProductAssert } from '../mock_data/mock_data';

const userModel = new UserModel();
const productModel = new ProductModel();
const request = supertest(app);
let userToken = '';

describe('Product Model', () => {
	describe('Test methods exist', () => {
		it('Index method should exist', () => {
			expect(productModel.index).toBeDefined();
		});

		it('Show method should exist', () => {
			expect(productModel.show).toBeDefined();
		});

		it('Create method should exist', () => {
			expect(productModel.create).toBeDefined();
		});

		it('Edit method should exist', () => {
			expect(productModel.edit).toBeDefined();
		});

		it('Delete method should exist', () => {
			expect(productModel.delete).toBeDefined();
		});
	});

	describe('Test methods return correct values', () => {
		it('Create method should return a Product', async () => {
			const result = await productModel.create(mockedProductObjectOne);
      const obj: IProductAssert = {
        name: mockedProductObjectOne.name,
        price: mockedProductObjectOne.price.toString(),
        category: mockedProductObjectOne.category
      };
      obj.price += '' ;
			expect(result).toEqual(
				jasmine.objectContaining(obj)
			);
		});

		it('Index method should return array of users with testUser in it', async () => {
			const result = await productModel.index();
			expect(result).toEqual([
				jasmine.objectContaining({
					name: mockedProductObjectOne.name
				})
			]);
		});

		it('Show method should return widget when called with ID', async () => {
			const result = await productModel.show(1);
			expect(result).toEqual(
				jasmine.objectContaining({
					name: mockedProductObjectOne.name
				})
			);
		});

		it('Edit method should return a product with edited properties', async () => {
      const editedUser: IProductAssert = {
        name: mockedProductObjectOne.name,
        price: mockedProductObjectOne.price.toString(),
        category: mockedProductObjectOne.category
      };
      editedUser.id = 1;

			const result = await productModel.edit({id: 1, ...mockedProductObjectOne});
			expect(result).toEqual(
				jasmine.objectContaining({
					price: editedUser.price.toString()
				})
			);
		});

		it('Delete method should return', async () => {
			const result = await productModel.delete(1);
			expect(result).toEqual(
				jasmine.objectContaining({
					name: mockedProductObjectOne.name
				})
			);
		});
	});

	describe('Test API Endpoints', () => {
		beforeAll(async () => {
			await userModel.create(mockedUserObjectOne);

			await productModel.create(mockedProductObjectOne);
		});

		afterAll(async () => {
			const connection = await client.connect();
			const sql =
				'DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n';
			await connection.query(sql);
			connection.release();
		});

		it('Check if server runs, should return 200 status', async () => {
			const response = await request.get('/');
			expect(response.status).toBe(200);
		});

		it('Authenticate user and get token', async () => {
			const response = await request
				.post('/users/authenticate')
				.set('Content-type', 'application/json')
				.send({
					userName: mockedUserObjectOne.userName,
					password: mockedUserObjectOne.password
				});
			expect(response.status).toBe(200);

			userToken = response.body;
		});

		it('Test Index should return array of products', async () => {
			const response = await request
				.get('/products')
				.set('Authorization', 'Bearer ' + userToken);
			expect(response.status).toBe(200);
			expect(response.body).toEqual([
				jasmine.objectContaining({
					name: mockedProductObjectOne.name
				})
			]);
		});

		it('Test Show should return product', async () => {
			const response = await request
				.get('/products/2')
				.set('Authorization', 'Bearer ' + userToken);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					name: mockedProductObjectOne.name
				})
			);
		});

		it('Test Create should return created Product', async () => {
			const response = await request
				.post('/products')
				.set('Authorization', 'Bearer ' + userToken)
				.send(mockedProductObjectTwo);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					name: mockedProductObjectTwo.name
				})
			);
		});

		it('Test edit should return edited User', async () => {
      const editedUser: IProductAssert = {
        name: mockedProductObjectOne.name,
        price: mockedProductObjectOne.price.toString(),
        category: mockedProductObjectOne.category
      };
      editedUser.id = 3;
      editedUser.price = '199.99';
			const response = await request
				.patch('/products/2')
				.set('Authorization', 'Bearer ' + userToken)
				.send(editedUser);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					price: editedUser.price
				})
			);
		});

		it('Test delete should return deleted Product', async () => {
			const response = await request
				.delete('/products')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					id: 3
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					name: mockedProductObjectOne.name
				})
			);
		});
	});
});
