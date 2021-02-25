import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendMailService from '../services/SendMailService';
import path, { resolve } from 'path';


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
            return response.status(400).json({
                error: "Survey does not exist"
            });
        }



        const variables = {
            name: userAlreadyExist.name,
            title: survey.title,
            description: survey.description,
            user_id: userAlreadyExist.id,
            link: process.env.URL_MAIL,
        };

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
            where: [{ userId: userAlreadyExist.id }, { value: null }],
            relations: ["user", "survey"]
        });

        if (surveyUserAlreadyExist) {
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExist);
        }



        const surveyUser = surveysUsersRepository.create({
            userId: userAlreadyExist.id,
            surveyId
        })

        await surveysUsersRepository.save(surveyUser);



        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);

    }

}

export { SendMailController };