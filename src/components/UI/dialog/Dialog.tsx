import React, {memo, ReactNode, useDeferredValue, useEffect} from 'react';
import {useDialog} from "../../../utils/hooks/useDialog";

import './dialog.scss'
import FocusTrap from "focus-trap-react";

type props = {
    id: string,
    open: boolean,
    onClose: () => void,
    children: ReactNode,
}

// TODO: add memoized
export const Dialog = memo(({id, open, children, onClose}: props) => {
    const {addDialog, closeDialog} = useDialog()
    const deferOpen = useDeferredValue(open)
    // console.log(deferOpen, open,id)
    useEffect(() => {
        if (open) {
            addDialog(
                id,
                <FocusTrap
                    active={deferOpen}
                    focusTrapOptions={{
                        allowOutsideClick: true,
                        onDeactivate:()=> {
                            // console.log('pkp', open)
                            // if (!open)
                                onClose()
                        }
                    }}
                >
                    <div className="dialog">
                        {children}
                     </div>
                 </FocusTrap>
            )
        } else {
            closeDialog(id)
            // console.log('close',id)
        }
    }, [id, deferOpen, children]);

    useEffect(() => {
        return () => {
            closeDialog(id)
            // onClose()
            // console.log('close effect',id)
        }
    }, [id]);
    return (
        <></>
    );
});

type titleProps = {
    children: ReactNode
}

export const DialogTitle = ({children}: titleProps) => {
    return (
        <div className="dialog-header">
            {children}
        </div>
    )
}

type helpTextProps = {
    children: ReactNode
}

export const DialogHelpText = ({children}: helpTextProps) => {
    return (
        <div className="dialog-help-text">
            {children}
        </div>
    )
}

type bodyProps = {
    children: ReactNode
}

export const DialogBody = ({children}: bodyProps) => {
    return (
        <div className="dialog-body">
            {children}
        </div>
    )
}

type actionProps = {
    children: ReactNode
}

export const DialogActions = ({children}: actionProps) => {
    return (
        <div className="dialog-actions">
            {children}
        </div>
    )
}
