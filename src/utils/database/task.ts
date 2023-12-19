import {db} from "./database";
import {DexieTaskModel, TaskModel} from "../dataModels/task";
import dayjs from "dayjs";

const convertToDexieTaskModel = ({startTime, endTime, ...task}: Omit<TaskModel, "id">): Omit<DexieTaskModel, "id"> => {
    return {
        ...task,
        startTime: startTime.getTime(),
        endTime: endTime.getTime()
    }
}

export const convertToTaskModel =  ({startTime, endTime, ...task}: Omit<DexieTaskModel, "id">): Omit<TaskModel, "id"> => {
    return {
        ...task,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
    }
}

export const deleteTaskInDatabase = async (id: number): Promise<number> => {
    db.tasks.delete(id)
    return id
};

export const createTaskInDatabase = async (task: Omit<TaskModel, "id">): Promise<number> =>
    await db.tasks.add(convertToDexieTaskModel(task))

export const updateTaskInDatabase = async ({id, ...task}: TaskModel): Promise<TaskModel> => {
    const convertedTask = convertToDexieTaskModel(task)
    db.tasks.update(id, convertedTask).then(res => res)
    return {id, ...task}
}

export const readAllTaskFromDatabase = async () => {
    return db.tasks.toArray()
}

export const readTasksFromDatabase = async (startTime: Date, endTime: Date) => {
    // console.log( await db.tasks.toArray())
    const result = await db.tasks
        .where("[startTime+endTime]")
        .between([startTime.getTime(), startTime.getTime()], [endTime.getTime(), endTime.getTime()], true, true)
        .toArray()
    return result
}
export const readDayTasksFromDatabase = async (day: Date) => {
    const nextDay = dayjs(day).add(1, "day").toDate().getTime()
    // console.log( await db.tasks.toArray())
    const result = await db.tasks
        .where("[startTime+endTime]")
        .between([day.getTime(), day.getTime()], [nextDay, nextDay], true, true)
        .toArray()
    return result
}
export const readDayTasksCountFromDatabase = async (day: Date) => {
    // console.log( await db.tasks.toArray())
    const nextDay = dayjs(day).add(1, "day").toDate().getTime()
    const result = await db.tasks
        .where("[startTime+endTime]")
        .between([day.getTime(), day.getTime()], [nextDay, nextDay], true, true)
        .count()
    return result
}
// export const getTaskDays = async (startTime: Date, endTime: Date) => {
//     // console.log( await db.tasks.toArray())
//     const result = await db.tasks
//         .where("[startTime+endTime]")
//         .between([startTime.getTime(),startTime.getTime()], [endTime.getTime(),endTime.getTime()], true, true)
//         .toArray()
//     return result
// }
