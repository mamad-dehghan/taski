import React, {useMemo} from 'react';
import {panels} from "./app_sidebar";
import {CalendarPanel} from "./panels/CalendarPanel";
import {CategoriesPanel} from "./panels/CategoriesPanel";

type props = {
    active?: panels
}

export const AppSidePanel = ({active}: props) => {
    const panel = useMemo(()=>{
        switch (active) {
            case panels.calendar:
                return <CalendarPanel />
            case panels.categories:
                return <CategoriesPanel />
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
