import { Router } from 'express';
import { UserController } from './controllers/userController';
import { SurveyController } from './controllers/surveyController';
import { SendMailController } from './controllers/SendMailController';

const router = Router();
const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();



router.post("/users", userController.create);
router.post("/surveys", surveyController.create);
router.post("/sendMail", sendMailController.execute);

router.get("/surveys", surveyController.show);

export { router };