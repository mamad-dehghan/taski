import React, {CSSProperties, useContext, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import dayjs, {Dayjs} from "dayjs";
import classNames from "classnames";
import {useLiveQuery} from "dexie-react-hooks";
import {CalendarContext} from "../../providers/calendarContext/calendarContext";
import {useMonthObject} from "../../utils/calendar/month";
import {
    convertToTaskModel,
    readDayTasksFromDatabase,
    updateTaskDoneInDatabase
} from "../../utils/database/task";
import {DexieTaskModel, TaskModel} from "../../utils/dataModels/task";
import {readCategoryById} from "../../utils/database/category";
import {Checkbox} from "../UI/checkBox/CheckBox";
import {TaskDialogHandle, TaskDialogHost} from "../dialogs/TaskDialogHost";
import {colorOptions} from "../../providers/theme/types";
import {useToast} from "../../utils/hooks/useToast";

import "./scheduleView.scss";

type dayWithTasks = {
    day: Dayjs,
    tasks: TaskModel[],
}

const toTaskModel = (task: Omit<DexieTaskModel, "id">): TaskModel => ({
    ...convertToTaskModel(task),
    id: (task as DexieTaskModel).id,
})

const sortTasks = (tasks: TaskModel[]): TaskModel[] =>
    [...tasks].sort((a, b) => {
        if (a.isAllDay !== b.isAllDay)
            return a.isAllDay ? -1 : 1
        if (a.isDone !== b.isDone)
            return a.isDone ? 1 : -1
        return a.startTime.getTime() - b.startTime.getTime()
    })

export const ScheduleView = () => {
    const {day, dayjsLocal} = useContext(CalendarContext)
    const navigate = useNavigate()
    const dialogRef = useRef<TaskDialogHandle>(null)
    const [month, setMonth] = useState<Dayjs>(() => dayjsLocal(dayjs(day)).startOf("month"))

    useEffect(() => {
        setMonth(dayjsLocal(dayjs(day)).startOf("month"))
    }, [day])

    const monthObject = useMonthObject(month)
    const days = useMemo(
        () => monthObject.filter(item => item.isSame(month, "month")),
        [monthObject, month]
    )

    const daysWithTasks = useLiveQuery<dayWithTasks[], dayWithTasks[]>(
        async () => {
            const allTasks = await Promise.all(
                days.map(item => readDayTasksFromDatabase(item.toDate()))
            )
            return days.map((item, index) => ({
                day: item,
                tasks: sortTasks(allTasks[index].map(toTaskModel)),
            }))
        },
        [days],
        []
    ) ?? []

    const visibleDays = daysWithTasks.filter(item => item.tasks.length > 0)

    if (!day)
        return <></>

    return (
        <div className="schedule-view">
            <header className="schedule-view--header">
                <h2 className="schedule-view--title">{month.format("MMMM YYYY")}</h2>
                <span className="schedule-view--subtitle">
                    {visibleDays.length === 0
                        ? "No tasks this month"
                        : `${visibleDays.reduce((count, item) => count + item.tasks.length, 0)} task(s) this month`}
                </span>
            </header>
            {
                visibleDays.length === 0 ?
                    <p className="schedule-view--empty">Nothing scheduled for this month.</p>
                    :
                    visibleDays.map(item =>
                        <section key={item.day.toJSON()} className="schedule-view--day">
                            <button
                                type="button"
                                className="schedule-view--day-header"
                                onClick={() => navigate(`/dashboard/calendar/day/${dayjs(item.day).calendar("gregory").locale('en').format("YYYY-MM-DD")}`)}>
                                <span className="schedule-view--day-name">{item.day.format("ddd")}</span>
                                <span className="schedule-view--day-date">{item.day.format("D MMMM")}</span>
                            </button>
                            <div className="schedule-view--tasks">
                                {
                                    item.tasks.map(task =>
                                        <ScheduleTaskRow
                                            key={task.id}
                                            task={task}
                                            onOpen={() => dialogRef.current?.openTask(task)} />
                                    )
                                }
                            </div>
                        </section>
                    )
            }
            <TaskDialogHost ref={dialogRef} />
        </div>
    )
}

type scheduleTaskRowProps = {
    task: TaskModel,
    onOpen: () => void,
}

const ScheduleTaskRow = ({task, onOpen}: scheduleTaskRowProps) => {
    const {dayjsLocal} = useContext(CalendarContext)
    const {toast} = useToast()
    const category = useLiveQuery(() => readCategoryById(task.categoryId), [task.categoryId])
    const [isDone, setIsDone] = useState<boolean>(task.isDone)

    useEffect(() => {
        setIsDone(task.isDone)
    }, [task.id, task.isDone])

    const handleToggleDone = async (checked: boolean) => {
        const previousValue = isDone
        setIsDone(checked)
        try {
            await updateTaskDoneInDatabase(task.id, checked)
        } catch (error) {
            setIsDone(previousValue)
            toast(
                `schedule-task-done-error-${task.id}`,
                error instanceof Error ? error.message : "Could not update task.",
                colorOptions.error
            )
        }
    }

    return (
        <div
            className={classNames("schedule-view--task", isDone && "done")}
            style={{"--category-color": category?.color} as CSSProperties}>
            <Checkbox
                checked={isDone}
                onChange={event => handleToggleDone(event.currentTarget.checked)}
                aria-label={isDone ? "Mark task as active" : "Mark task as done"} />
            <button type="button" className="schedule-view--task-content" onClick={onOpen}>
                <span className="schedule-view--task-time">
                    {task.isAllDay
                        ? "All day"
                        : `${dayjsLocal(dayjs(task.startTime)).format("HH:mm")} – ${dayjsLocal(dayjs(task.endTime)).format("HH:mm")}`}
                </span>
                <span className="schedule-view--task-title">{task.title}</span>
                <span className={`schedule-view--task-priority priority-${task.priority}`}>{task.priority}</span>
                {category ? <span className="schedule-view--task-category">{category.title}</span> : undefined}
            </button>
        </div>
    )
}
