import {Context, createContext, ReactNode, useCallback, useEffect, useState} from "react";
import classNames from "classnames";
import {colorOptions} from "../theme/types";

import './toast_provider.scss'

type toastT = {
    id: string,
    severity: colorOptions,
    content: string
}
type toastContextT = {
    closeToast: (id: string) => void,
    closeAllToasts: () => void,
    toast: (id: string, content: string, severity: colorOptions) => void
}
export const ToastContext: Context<toastContextT> = createContext({} as toastContextT)

type props = {
    children: ReactNode
}
//TODO: maybe add hide in css or setTimeout
export const ToastProvider = ({children}: props) => {
    const [availableToasts, setAvailableToasts] = useState<(toastT & { addedTime: number })[]>([])
    console.log(availableToasts);
    const closeAllToasts = useCallback(() => setAvailableToasts([]), [])
    const closeToast = useCallback((id: string) => setAvailableToasts(prevState => prevState.filter(toast => toast.id !== id)), []);
    const addToast = useCallback((id: string, content: string, severity: colorOptions) => {
        const index = availableToasts.findIndex(toast => toast.id === id);
        if (index === -1) {
            setAvailableToasts(prevState => [...prevState, {id, severity, content, addedTime: Date.now()}])
        } else {
            const toasts = availableToasts;
            toasts[index] = {id, severity, content, addedTime: availableToasts[index].addedTime}
            setAvailableToasts(toasts);

        }
    }, [])

    useEffect(() => {
        setAvailableToasts(prevState => prevState.filter(toast => Date.now() - toast.addedTime < 10000))
    }, [availableToasts.reduce((str, item) => str + "/" + item.id, "")])

    return (
        <ToastContext.Provider value={{closeAllToasts, closeToast, toast: addToast}}>
            <>
                {children}
                <div className="toasts-wrapper">
                    {
                        availableToasts.map(toast =>
                            <Alert key={toast.id} onClose={() => closeToast(toast.id)} severity={toast.severity}>
                                {toast.content}
                            </Alert>
                        )
                    }
                </div>
            </>
        </ToastContext.Provider>
    )

}

type alertT = {
    onClose: () => void,
    severity: colorOptions,
    children: string
}

const Alert = ({onClose, severity, children}: alertT) => {
    return (
        <div className={classNames("toast", severity)}>
            <p>{children}</p>
            <button onClick={onClose}>i</button>
        </div>
    )
}
