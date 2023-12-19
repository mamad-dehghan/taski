// import {number, string} from "yup";

export type TaskModel = {
    id: number,
    title: string,
    description?: string,
    startTime: Date,
    endTime: Date,
    File?: File[] | FileList,
    // tags: string[],
    tags?: string,
    priority: "low" | "medium" | "high",
    // progress: number
    progress: number,
    category?: string,
    // user_id:number,
}
export type DexieTaskModel = {
    id: number,
    title: string,
    description?: string,
    startTime: number,
    endTime: number,
    File?: File[] | FileList,
    // tags: string[],
    tags?: string,
    priority: "low" | "medium" | "high",
    // progress: number
    progress: number,
    category?: string,
    // user_id:number,
}
