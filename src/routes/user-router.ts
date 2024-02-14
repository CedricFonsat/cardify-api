import { Request, Response, Router } from "express";
import { userController } from "../controllers/user-controller";
import { AuthenticatedRequest } from "../types/Interface";
import auth from "../services/auth-service";
import { uploadAvatar } from "../services/multer-service";

export const userRouter = Router();

userRouter.get('/', async (req: Request ,res: Response) => {
    await userController.getUsers(req, res);
});

userRouter.get('/me', auth, async (req: AuthenticatedRequest, res: Response) => {
    await userController.getUserMe(req, res);
});

userRouter.post('/follow/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
    await userController.setFollow(req, res);
});

userRouter.post('/unfollow/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
    await userController.setUnfollow(req, res);
});

userRouter.get('/followings-me', auth, async (req: AuthenticatedRequest, res: Response) => {
    await userController.getFollowingsMe(req, res);
});

userRouter.get('/followers-me', auth, async (req: AuthenticatedRequest, res: Response) => {
    await userController.getFollowersMe(req, res);
});

userRouter.get('/followings/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
    await userController.getFollowingsById(req, res);
});

userRouter.get('/followers/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
    await userController.getFollowersById(req, res);
});

userRouter.post('/edit/:id', auth, uploadAvatar.single('avatar'), async (req: AuthenticatedRequest, res: Response) => {
    await userController.setEditUserById(req, res);
});

userRouter.post('/delete/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
    await userController.setDeleteUserById(req, res);
});



// add systeme badges if 5 cards bought

//paid for cretor role 