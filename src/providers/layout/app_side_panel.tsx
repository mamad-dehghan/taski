import React, {useMemo} from 'react';
import {panels} from "./app_sidebar";
import {CalendarPanel} from "./panels/CalendarPanel";
import {ComponentsPanel} from "./panels/ComponentsPanel";

type props = {
    active?: panels
}

export const AppSidePanel = ({active}: props) => {
    const panel = useMemo(()=>{
        switch (active) {
            case panels.calendar:
                return <CalendarPanel />
            case panels.schedule:
                return <ComponentsPanel />
            case panels.preference:
                return "preference"
            default:
                return undefined
        }
    },[active])
    return (
        <div className="app-side-panel">
            {panel}
        </div>
    );
};
