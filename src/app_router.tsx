import React from 'react';
import {Route, Routes} from "react-router-dom";
import AppLayout from "./providers/layout/app_layout";
import {Setting} from "./pages/setting/setting";


const AppRouter = ({}: {}) => {
    return (
        <Routes>
            <Route path={'/login'} element={<></>}/>
            <Route path={'/sign-in'} element={<></>}/>
            <Route path='/dashboard/' element={<AppLayout/>}>
                <Route path={'calendar'} element={<></>}/>
                <Route path={'setting'} element={<Setting/>}/>
            </Route>
        </Routes>
    );
};

export default AppRouter;
