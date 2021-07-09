import { mockedUserObjectTwo } from './../mock_data/mock_data';
import { UserModel } from '../../src/models/userModel';
import supertest from 'supertest';
import app from '../../src/server';
import client from '../../src/db';
import { mockedUserObjectOne } from '../mock_data/mock_data';

const userModel = new UserModel();
const request = supertest(app);
let userToken = '';

describe('User Model', () => {
	describe('Test methods exist', () => {
		it('Index method should exist', () => {
			expect(userModel.index).toBeDefined();
		});

		it('Show method should exist', () => {
			expect(userModel.show).toBeDefined();
		});

		it('Create method should exist', () => {
			expect(userModel.create).toBeDefined();
		});

		it('Edit method should exist', () => {
			expect(userModel.edit).toBeDefined();
		});

		it('Delete method should exist', () => {
			expect(userModel.delete).toBeDefined();
		});

		it('Authenticate method should exist', () => {
			expect(userModel.authenticate).toBeDefined();
		});
	});

	describe('Test methods return correct values', () => {
		afterAll(async () => {
			const connection = await client.connect();
			const sql =
				'DELETE FROM users; \nALTER SEQUENCE users_id_seq RESTART WITH 1;\n';
			await connection.query(sql);
			connection.release();
		});
		it('Create method should return a User', async () => {
			const result = await userModel.create({
				userName: 'testUser',
				firstName: 'Test',
				lastName: 'User',
				password: 'test123'
			});
			expect(result).toEqual(
				jasmine.objectContaining({
					userName: 'testUser',
					firstName: 'Test',
					lastName: 'User'
				})
			);
		});

		it('Index method should return array of users with testUser in it', async () => {
			const result = await userModel.index();
			expect(result).toEqual([
				jasmine.objectContaining({
					userName: 'testUser'
				})
			]);
		});

		it('Show method should return testUser when called with ID', async () => {
			const result = await userModel.show(1);
			expect(result).toEqual(
				jasmine.objectContaining({
					userName: 'testUser'
				})
			);
		});

		it('Edit method should return a User with edited properties', async () => {
			const result = await userModel.edit({
				id: 1,
				userName: 'testUser',
				firstName: 'TestEdit',
				lastName: 'User',
				password: 'test123'
			});
			expect(result).toEqual(
				jasmine.objectContaining({
					firstName: 'TestEdit'
				})
			);
		});

		it('Authenticate method should return authenticated user', async () => {
			const result = await userModel.authenticate('testUser', 'test123');
			expect(result).toBeDefined;
		});

		it('Delete method should return', async () => {
			const result = await userModel.delete(1);
			expect(result).toEqual(
				jasmine.objectContaining({
					id: 1
				})
			);
		});
	});

	describe('Test API Endpoints', () => {
		beforeAll(async () => {
			await userModel.create(mockedUserObjectOne);
		});

		afterAll(async () => {
			const connection = await client.connect();
			const sql =
				'DELETE FROM users; \nALTER SEQUENCE users_id_seq RESTART WITH 1;\n';
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

		it('Test Index should return array of users', async () => {
			const response = await request
				.get('/users')
				.set('Authorization', 'Bearer ' + userToken);
			expect(response.status).toBe(200);
			expect(response.body).toEqual([
				jasmine.objectContaining({
					userName: mockedUserObjectOne.userName
				})
			]);
		});

		it('Test Show should return User', async () => {
			const response = await request
				.get('/users/1')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					id: 1
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					userName: mockedUserObjectOne.userName
				})
			);
		});

		it('Test Create should return created User', async () => {
			const response = await request
				.post('/users')
				.set('Authorization', 'Bearer ' + userToken)
				.send(mockedUserObjectTwo);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					userName: mockedUserObjectTwo.userName
				})
			);
		});

		it('Test edit should return edited User', async () => {
      const editedMockUser = { id:1, ...mockedUserObjectOne};
      editedMockUser.firstName = 'Edited'
			const response = await request
				.patch('/users/2')
				.set('Authorization', 'Bearer ' + userToken)
				.send(editedMockUser);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					firstName: editedMockUser.firstName
				})
			);
		});

		it('Test delete should return deleted User', async () => {
			const response = await request
				.delete('/users')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					id: 2
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					userName: mockedUserObjectTwo.userName
				})
			);
		});
	});
});
