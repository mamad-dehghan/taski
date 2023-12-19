import React from 'react';
import {Route, Routes} from "react-router-dom";
import AppLayout from "./providers/layout/app_layout";
import {Setting} from "./pages/setting/setting";
import App from "./App";
import {Calendar} from "./pages/calendar/Calendar";
import {SignUpPage} from "./pages/signup/SignUpPage";
import {Login} from "./pages/Login/Login";
// import {ButtonsPage} from "./pages/components/ButtonsPage";
// import {IconButtonPage} from "./pages/components/IconButtonPage";
// import {SwitchPage} from "./pages/components/SwitchPage";
// import {ChipPage} from "./pages/components/ChipPage";

export const AppRouter = React.memo(() => (
    <Routes>
        <Route path={'/login'} element={<Login />} />
        <Route path={'/app'} element={<App />} />
        {/*<Route path={'/sign-in'} element={<SignUpPage />} />*/}
        <Route path='/dashboard/' element={<AppLayout />}>
            <Route path={'calendar/:mode/:day'} element={<Calendar />} />
            <Route path={'setting'} element={<Setting />} />
            {/*<Route path={'components/'} >*/}
            {/*    <Route path={'button'} element={<ButtonsPage />}/>*/}
            {/*    <Route path={'icon-button'} element={<IconButtonPage />}/>*/}
            {/*    <Route path={'switch'} element={<SwitchPage />}/>*/}
            {/*    <Route path={'chip'} element={<ChipPage />}/>*/}
            {/*</Route>*/}
        </Route>
    </Routes>
));
