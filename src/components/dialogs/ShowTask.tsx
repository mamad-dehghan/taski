import React, {useEffect, useId, useState} from 'react';
import {Dialog, DialogActions, DialogHelpText, DialogTitle} from "../UI/dialog/Dialog";
import {TaskModel} from "../../utils/dataModels/task";
import {FAB} from "../UI/fab/FAB";
import {PencilLine} from "@phosphor-icons/react";
import {Button} from "../UI/button/Button";
import {Checkbox} from "../UI/checkBox/CheckBox";
import {colorOptions, fillOptions} from "../../providers/theme/types";
import {deleteTaskInDatabase, updateTaskDoneInDatabase} from "../../utils/database/task";
import {useToast} from "../../utils/hooks/useToast";

type props = {
    open: boolean,
    onClose: () => void,
    task?: TaskModel,
    onOpenEditDialog: () => void,
}

export const ShowTaskDialog = ({open, task, onClose, onOpenEditDialog}: props) => {
    const id = useId()
    const {toast} = useToast()
    const [isDone, setIsDone] = useState<boolean>(task?.isDone ?? false)
    const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false)

    useEffect(() => {
        setIsDone(task?.isDone ?? false)
        setConfirmingDelete(false)
    }, [task?.id, task?.isDone, open])

    const handleToggleDone = async (checked: boolean) => {
        if (!task)
            return
        const previousValue = isDone
        setIsDone(checked)
        try {
            await updateTaskDoneInDatabase(task.id, checked)
            toast(
                `task-done-${task.id}`,
                checked ? "Task marked as done." : "Task marked as active.",
                colorOptions.success
            )
        } catch (error) {
            setIsDone(previousValue)
            toast(
                `task-done-error-${task.id}`,
                error instanceof Error ? error.message : "Could not update task.",
                colorOptions.error
            )
        }
    }

    const handleDelete = async () => {
        if (!task)
            return
        try {
            await deleteTaskInDatabase(task.id)
            toast(`task-delete-${task.id}`, "Task deleted.", colorOptions.success)
            onClose()
        } catch (error) {
            toast(
                `task-delete-error-${task.id}`,
                error instanceof Error ? error.message : "Could not delete task.",
                colorOptions.error
            )
        }
    }

    return (
        <Dialog open={open} onClose={onClose} id={id + 'show-todo'}>
            <DialogTitle>
                <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                    <Checkbox
                        checked={isDone}
                        onChange={event => handleToggleDone(event.currentTarget.checked)}
                        aria-label={isDone ? "Mark task as active" : "Mark task as done"} />
                    <p style={{
                        flex: 1,
                        textDecoration: isDone ? "line-through" : undefined,
                        opacity: isDone ? 0.7 : undefined
                    }}>
                        {task?.title}
                    </p>
                    <FAB onClick={onOpenEditDialog}>
                        <PencilLine />
                    </FAB>
                </div>
            </DialogTitle>
            {
                task?.description ?
                    <DialogHelpText>{task.description}</DialogHelpText>
                    : undefined
            }
            <DialogActions>
                {
                    confirmingDelete ?
                        <>
                            <span style={{marginInlineEnd: "auto"}}>Delete this task?</span>
                            <Button
                                type="button"
                                fill={fillOptions.tonal}
                                onClick={() => setConfirmingDelete(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                color={colorOptions.error}
                                onClick={handleDelete}>
                                Delete
                            </Button>
                        </>
                        :
                        <>
                            <Button
                                type="button"
                                color={colorOptions.error}
                                fill={fillOptions.link}
                                onClick={() => setConfirmingDelete(true)}>
                                Delete
                            </Button>
                            <Button onClick={onClose} type="button" fill={fillOptions.tonal}>
                                Close
                            </Button>
                        </>
                }
            </DialogActions>
        </Dialog>
    );
};
