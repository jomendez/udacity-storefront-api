import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './handler/usersController';
import productRoutes from './handler/productControllers';
import orderRoutes from './handler/ordersController';

dotenv.config();

const EXPRESS_PORT = process.env.EXPRESS_PORT;

const app: express.Application = express();
const address = `0.0.0.0:${EXPRESS_PORT}`;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello Storefront!');
});

app.listen(3000, () => {
	console.log(`starting on: ${address}`);
});

productRoutes(app);
userRoutes(app);
orderRoutes(app);

export default app;
