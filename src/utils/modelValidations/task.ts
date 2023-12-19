import {date, number, string} from "yup";
export const taskValidations = {
    // _id:number().required(),
    title: string().required(),
    description: string().required(),
    startTime: date(),
    endTime: date(),
    File: string(),
    tags: string(),
    priority: string().required().oneOf(["low", "medium","high"]),
    progress: number().required()
}
