import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendMailService from '../services/SendMailService';
import path, { resolve } from 'path';
import { AppError } from '../ERRORS/AppError';


class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, surveyId } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExist = await usersRepository.findOne({ email });

        if (!userAlreadyExist) {
            return response.status(400).json({
                error: "User does not exist"
            });
        }


        const survey = await surveysRepository.findOne({ id: surveyId });

        if (!survey) {
            throw new AppError("Survey does not exist");
        }





        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
            where: { userId: userAlreadyExist.id, value: null },
            relations: ["user", "survey"]
        });

        const variables = {
            name: userAlreadyExist.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,
        };

        if (surveyUserAlreadyExist) {
            variables.id = surveyUserAlreadyExist.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExist);
        }



        const surveyUser = surveysUsersRepository.create({
            userId: userAlreadyExist.id,
            surveyId
        })

        await surveysUsersRepository.save(surveyUser);

        variables.id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);

    }

}

export { SendMailController };