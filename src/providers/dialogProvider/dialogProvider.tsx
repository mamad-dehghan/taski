import {Context, createContext, memo, ReactNode, useState} from "react";
import "./dialog_provider.scss"
import FocusTrap from "focus-trap-react";

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

    // const addDialog = useCallback((id: string, component: ReactNode) => {
    //     setDialogs(prevState => {
    //         const index = prevState.findIndex(item => item.id === id);
    //             console.log(index, prevState)
    //         if (index === -1) {
    //             return [...prevState, {id, component}]
    //         } else {
    //             return [...prevState.filter(item => item.id === id), {id, component}]
    //         }
    //     })
    // }, [setDialogs])

    // const closeDialog = useCallback((id: string) => {
    //     setDialogs(prevState => prevState.filter(item => item.id !== id))
    // }, [])
    //
    // const closeAllDialogs = useCallback(() => {
    //     setDialogs([])
    // }, [])
    // console.log("render in dialog provider")
    return (
        <dialogContext.Provider
            value={{
                addDialog: (id: string, component: ReactNode) => {
                    setDialogs(prevState => {
                        return [...prevState.filter(item => item.id !== id), {id, component}]
                        // const index = prevState.findIndex(item => item.id === id);
                        // console.log(index, prevState)
                        // if (index === -1) {
                        //     return [...prevState, {id, component}]
                        // } else {
                        //     // remove for not showing errors in dialogs
                        //     // return prevState
                        //     return [...prevState.filter(item => item.id !== id), {id, component}]
                        // }
                    })
                },
                closeDialog: (id: string) => {
                    setDialogs(prevState => prevState.filter(item => item.id !== id))
                },
                closeAllDialogs: () => {
                    setDialogs([])
                }
            }}>
            {children}
            <div className="dialogs-wrapper">
                {dialogs.map(item => {
                    return (
                        <SingleDialog onClose={()=>{setDialogs(prevState => prevState.filter(item2 => item2.id !== item.id))}} key={item.id} item={item} />
                        // <div key={item.id} className="single-dialog-wrapper">
                        //     {item.component}
                        // </div>
                    )
                })}
            </div>
        </dialogContext.Provider>
    )
}
const SingleDialog = memo(({item, onClose}: { item: dialogT, onClose:()=>void }) =>
    <div key={item.id} className="single-dialog-wrapper">
        {item.component}
            {/*</div>*/}
        {/*</FocusTrap>*/}
    </div>
)
