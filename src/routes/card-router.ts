import { Router, Request, Response } from "express";
import { cardController } from "../controllers/card-controller";
import { AuthenticatedRequest } from "../types/Interface";
import auth from "../services/auth-service";


export const cardRouter = Router();

cardRouter.post('/add', async (req: Request, res: Response) => {
    await cardController.setAddCard(req, res);
});

cardRouter.post('/delete/:id', async (req: Request, res: Response) => {
    await cardController.setDeleteCardById(req, res);
});

cardRouter.post('/update/:id', async (req: Request, res: Response) => {
    await cardController.setUpdateCardById(req, res);
});

cardRouter.get('/cards', async (req: Request, res: Response) => {
   await cardController.getCards(req, res);
});

cardRouter.post('/buy/:id', auth , async (req: AuthenticatedRequest, res: Response) => {
    await cardController.setBuyCardById(req, res);
});

cardRouter.post('/sell/:id', auth , async (req: AuthenticatedRequest, res: Response) => {
    await cardController.setSellCardById(req, res);
});

cardRouter.post('/buy/user/:id', auth , async (req: AuthenticatedRequest, res: Response) => {
    await cardController.setBuyUserCardById(req, res);
});

cardRouter.get('/sellers/cards', async (req: AuthenticatedRequest, res: Response) => {
    await cardController.getSellersCards(req, res);
});

cardRouter.get('/:query', async (req: AuthenticatedRequest, res: Response) => {
    await cardController.getCardsByQueryAndFilters(req, res);
});


// cardRouter.post('/:query'); add filter with req.body = limit, less -300, more 300 etc...
// cardRouter.post('/home'); trouver un autre nom que /home show collection and card and user popular and other features ranking user