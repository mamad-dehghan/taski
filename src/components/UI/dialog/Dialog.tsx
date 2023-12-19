import React, {ReactNode, useDeferredValue, useEffect} from 'react';
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
export const Dialog = ({id, open, children, onClose}: props) => {
    const {addDialog, closeDialog} = useDialog()
    const deferOpen = useDeferredValue(open)
    useEffect(() => {
        if (open) {
            addDialog(
                id,
                <FocusTrap
                    active={deferOpen}
                    focusTrapOptions={{
                        onDeactivate:()=> {
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
        }
    }, [id, deferOpen, children]);

    useEffect(() => {
        return () => {
            closeDialog(id)
        }
    }, [id]);
    return (
        <></>
    );
};

type titleProps = {
    children: ReactNode
}

Dialog.Title = ({children}: titleProps) => {
    return (
        <div className="dialog-header">
            {children}
        </div>
    )
}

type helpTextProps = {
    children: ReactNode
}

Dialog.HelpText = ({children}: helpTextProps) => {
    return (
        <div className="dialog-help-text">
            {children}
        </div>
    )
}

type bodyProps = {
    children: ReactNode
}

Dialog.Body = ({children}: bodyProps) => {
    return (
        <div className="dialog-body">
            {children}
        </div>
    )
}

type actionProps = {
    children: ReactNode
}

Dialog.Actions = ({children}: actionProps) => {
    return (
        <div className="dialog-actions">
            {children}
        </div>
    )
}
