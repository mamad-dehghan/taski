import {string} from "yup";

export const categoryValidations = {
    // _id:number().required(),
    title: string().required(),
    color: string().required(),
    description: string(),
}
