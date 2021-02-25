import { SurveyUser } from "../models/SurveyUser";
import { EntityRepository, Repository } from 'typeorm';
import { Survey } from "../models/Survey";

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<SurveyUser>{

}

export { SurveysUsersRepository };