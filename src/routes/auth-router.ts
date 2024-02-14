import { Router, Request, Response } from 'express';
import { authController } from '../controllers/auth-controller';

export const authRouter = Router();

authRouter.post('/signup', async (req: Request, res: Response) => {
    await authController.setSignup(req, res);
});

authRouter.post('/signin', async (req: Request, res: Response) => {
    await authController.setSignin(req, res);
});

authRouter.get('/cool', async (req: Request, res: Response) => {
    res.json({
        cocali:'ggggggggg',
    });
});

// change name roouter et use authRoute not authRouter
// /getUers, /addUser, /deleteUser, /updateUser, /getUserById etc..

// shema use user.ts note user-model.ts

// authRouter.post('/'); /reset-password, /reset-password/:token and other features