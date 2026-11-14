import React, {lazy, Suspense} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import AppLayout from "./providers/layout/app_layout";
import {Setting} from "./pages/setting/setting";
import {Calendar} from "./pages/calendar/Calendar";
import {Login} from "./pages/Login/Login";
import dayjs from "dayjs";

const App = lazy(()=>import("./App"))

export const AppRouter = React.memo(() => (
    <Routes>
        <Route path={'/login'} element={<Login />} />
        <Route path={'/app'} element={<Suspense fallback={"loading"}><App /></Suspense>} />
        {/*<Route path={'/sign-in'} element={<SignUpPage />} />*/}
        <Route path='/dashboard/' element={<AppLayout />}>
            <Route path={'calendar/:mode/:day'} element={<Calendar />} />
            <Route path={'setting'} element={<Setting />} />
        </Route>
        <Route path="*"
               element={<Navigate to={`/dashboard/calendar/day/${dayjs().format("YYYY-MM-DD")}`} replace={true}/>}
        />
    </Routes>
));
