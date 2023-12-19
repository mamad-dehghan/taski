import React, {useState} from 'react';
import {Dialog} from "../UI/dialog/Dialog";
import {TaskModel} from "../../utils/dataModels/task";
import {FAB} from "../UI/fab/FAB";
import {PencilLine} from "@phosphor-icons/react";
import {Button} from "../UI/button/Button";
import {fillOptions} from "../../providers/theme/types";
import {EditTodoDialog} from "./EditTask";
// import {Button} from "../UI/button/Button";

type props = {
    id: string,
    open: boolean,
    onClose: () => void,
    task: TaskModel
}

export const ShowTaskDialog = ({id, open, task, onClose}: props) => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    return (
        <>
        <Dialog open={open} onClose={onClose} id={id}>
            <Dialog.Title>
                <p>
                {task.title}
                </p>
                <FAB onClick={()=>{
                    setOpenModal(true)
                    onClose()
                }}>
                    <PencilLine />
                </FAB>
            </Dialog.Title>
            <Dialog.HelpText>
                {task.description}
            </Dialog.HelpText>
            <Dialog.Actions>
                <Button onClick={onClose} type="button" fill={fillOptions.tonal}>
                    Close
                </Button>
            </Dialog.Actions>
        </Dialog>
            <EditTodoDialog
                id={`edit-todo-${task.id}`}
                open={openModal}
                task={task}
                onClose={() => {
                    setOpenModal(false)
                }} />
        </>
    );
};
