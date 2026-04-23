import { extend } from "lodash";
import { IModelBase } from "./iModelBase";
import { Application } from "./aplications";

export interface iAplicationResponse extends IModelBase {
    application_id: string;
    question_id: string;
    answer: string;
    application: Application;
    question: any[];

}   