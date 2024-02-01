import React, {memo, useId, useState} from 'react';
import {Dialog, DialogActions, DialogHelpText, DialogTitle} from "../UI/dialog/Dialog";
import {TaskModel} from "../../utils/dataModels/task";
import {FAB} from "../UI/fab/FAB";
import {PencilLine} from "@phosphor-icons/react";
import {Button} from "../UI/button/Button";
import {fillOptions} from "../../providers/theme/types";
import {EditTodoDialog} from "./EditTask";
// import {Button} from "../UI/button/Button";

type props = {
    // id: string,
    open: boolean,
    onClose: () => void,
    task?: TaskModel,
    onOpenEditDialog:()=>void,
}

export const ShowTaskDialog = (({open, task, onClose, onOpenEditDialog}: props) => {
    const id = useId()
    return (
        <>
            <Dialog open={open} onClose={onClose} id={id + 'show-todo'}>
                <DialogTitle>
                    <p>
                        {task?.title}
                    </p>
                    <FAB onClick={() => {
                        // setOpenModal(true)
                        // onClose()
                        onOpenEditDialog()
                    }}>
                        <PencilLine />
                    </FAB>
                </DialogTitle>
                <DialogHelpText>
                    {task?.description}
                </DialogHelpText>
                <DialogActions>
                    <Button onClick={onClose} type="button" fill={fillOptions.tonal}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {/*{*/}
            {/*    openModal && task ?*/}
            {/*        <EditTodoDialog*/}
            {/*            id={task?.id + `edit-todo`}*/}
            {/*            open={openModal}*/}
            {/*            task={task}*/}
            {/*            onClose={() => {*/}
            {/*                setOpenModal(false)*/}
            {/*            }} />*/}
            {/*        : <></>*/}
            {/*}*/}
        </>
    );
});
