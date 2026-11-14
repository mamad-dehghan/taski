import {forwardRef, memo, useDeferredValue, useImperativeHandle, useState} from "react";
import {TaskModel} from "../../utils/dataModels/task";
import {ShowTaskDialog} from "./ShowTask";
import {EditTodoDialog} from "./EditTask";

export type TaskDialogHandle = {
    openTask: (task: TaskModel) => void
}

export const TaskDialogHost = memo(forwardRef<TaskDialogHandle>((_, ref) => {
    const [task, setTask] = useState<TaskModel | undefined>(undefined)
    const [showOpen, setShowOpen] = useState<boolean>(false)
    const [editOpen, setEditOpen] = useState<boolean>(false)

    useImperativeHandle(ref, () => ({
        openTask: (task: TaskModel) => {
            setTask(task)
            setEditOpen(false)
            setTimeout(() => setShowOpen(true), 10)
        }
    }), [])

    const deferShowOpen = useDeferredValue(showOpen)
    if (!task && !deferShowOpen)
        return <></>

    return (
        <>
            <ShowTaskDialog
                open={showOpen}
                task={task}
                onClose={() => setShowOpen(false)}
                onOpenEditDialog={() => {
                    setShowOpen(false)
                    setEditOpen(true)
                }} />
            <EditTodoDialog
                key={task?.id}
                open={editOpen}
                onClose={() => setEditOpen(false)}
                task={task!} />
        </>
    )
}))
