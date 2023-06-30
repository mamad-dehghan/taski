import {Context, createContext, ReactNode, useCallback, useState} from "react";
import "./dialog_provider.scss"

export type dialogContextT = {
    addDialog: (id: string, component: ReactNode) => void,
    closeDialog: (id: string) => void,
    closeAllDialogs: () => void,
}

export const dialogContext: Context<dialogContextT> = createContext({} as dialogContextT)

type dialogT = {
    id: string,
    component: ReactNode
}

type props = {
    children: ReactNode;
}
export const DialogProvider = ({children}: props) => {
    const [dialogs, setDialogs] = useState<dialogT[]>([])
    const addDialog = useCallback((id: string, component: ReactNode) => {
        setDialogs(prevState => {
            const index = prevState.findIndex(item => item.id === id);
            if (index === -1)
                return [...prevState, {id, component}]
            else
                return [...prevState.filter(item => item.id === id), {id, component}]
        })
    }, [])
    const closeDialog = useCallback((id: string) => {
        console.log(id);
        setDialogs(prevState => prevState.filter(item => item.id === id))
    }, [])
    const closeAllDialogs = useCallback(() => {
        setDialogs([])
    }, [])
    // const openDialog()
    console.log(dialogs.map(item => item.id));
    return (
        <dialogContext.Provider value={{addDialog, closeDialog, closeAllDialogs}}>
            {children}
            <div className="dialogs-wrapper">
                {dialogs.map(item => {
                    return (
                        <div key={item.id} className="single-dialog-wrapper">
                            {item.component}
                        </div>
                    )
                })}
            </div>
        </dialogContext.Provider>
    )
}
