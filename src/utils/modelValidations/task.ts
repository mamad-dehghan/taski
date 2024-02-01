import {boolean, date, number, string} from "yup";

export const taskValidations = {
    // _id:number().required(),
    title: string().required(),
    description: string(),
    startTime: date().required(),
    endTime: date().required(),
    File: string(),
    tags: string(),
    priority: string().required().oneOf(["low", "medium", "high"]),
    isDone: boolean().required(),
    isAllDay: boolean().required(),
    categoryId: number()
}
