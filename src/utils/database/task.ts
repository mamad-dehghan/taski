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

export const convertToTaskModel = (
    {
        startTime,
        endTime,
        ...task
    }: Omit<DexieTaskModel, "id">): Omit<TaskModel, "id"> => {
    return {
        ...task,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
    }
}

export const deleteTaskInDatabase = async (id: number): Promise<number> => {
    await db.tasks.delete(id)
    return id
};
// TODO: avoid create when two task has override // except for daily tasks
export const createTaskInDatabase = async (task: Omit<TaskModel, "id">): Promise<number> => {
    const conflictTasks = await getConflictTask(task)
    console.log(conflictTasks)
    if (conflictTasks) {
        throw new Error("رویداد با رویدادی دیگر تداخل دارد.", {cause: "Conflict"})
    }
    return await db.tasks.add(convertToDexieTaskModel(task))
}

export const updateTaskInDatabase = async ({id, ...task}: TaskModel): Promise<TaskModel> => {
    const convertedTask = convertToDexieTaskModel(task)
    db.tasks.update(id, convertedTask).then(res => res)
    return {id, ...task}
}

export const readAllTaskFromDatabase = async (): Promise<DexieTaskModel[]> => {
    return db.tasks.toArray() as unknown as Promise<DexieTaskModel[]>
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

const getConflictTask = async (task: Pick<TaskModel, "startTime" | "endTime" | "categoryId" | "isAllDay">): Promise<Omit<DexieTaskModel, "id"> | undefined> => {
    if (!task.categoryId || task.isAllDay)
        return undefined
    return db.tasks
        .where("[startTime+endTime]")
        .below([task.endTime.getTime(), Infinity])
        .and((t) => t.endTime > task.startTime.getTime())
        // .and(findTask => findTask.categoryId === task.categoryId)
        .first()
}
