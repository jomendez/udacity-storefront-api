import express, { Request, Response } from 'express';
import { User, UserModel } from '../models/userModel';
import jwt from 'jsonwebtoken';
import verifyAuthToken from '../middleware/authorizationToken';

const store = new UserModel();

const index = async (_req: Request, res: Response) => {
	const users = await store.index();
	res.json(users);
};

const show = async (req: Request, res: Response) => {
	const user = await store.show(req.body.id as unknown as number);
	res.json(user);
};

const create = async (req: Request, res: Response) => {
	const userObj: User = {
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password
	};
	try {
		const user = await store.create(userObj);
		const token = jwt.sign(
			{
				user
			},
			process.env.TOKEN_SECRET as unknown as string
		);
		res.json({ ...user, token: token });
	} catch (err) {
		res.status(400);
		res.json(err + userObj);
	}
};

const edit = async (req: Request, res: Response) => {
	const user: User = {
		id: req.body.id,
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password
	};

	try {
		const updatedUser = await store.edit(user);
		return res.json(updatedUser);
	} catch (err) {
		res.status(400);
		res.json(err + user);
	}
};

const destroy = async (req: Request, res: Response) => {
	const deleted = await store.delete(req.body.id);
	res.json(deleted);
};

const authenticate = async (req: Request, res: Response) => {
	const userObj: User = {
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password
	};

	try {
		const user = await store.authenticate(userObj.userName, userObj.password);
		const token = jwt.sign(
			{
				user
			},
			process.env.TOKEN_SECRET as unknown as string
		);
		res.json(token);
	} catch (err) {
		res.status(401);
		res.json(err);
	}
};

const userRoutes = (app: express.Application): void => {
	app.get('/users', verifyAuthToken, index);
	app.get('/users/:id', verifyAuthToken, show);
	app.post('/users', verifyAuthToken, create);
	app.patch('/users/:id', verifyAuthToken, edit);
	app.delete('/users', verifyAuthToken, destroy);
	app.post('/users/authenticate', authenticate);
};

export default userRoutes;
