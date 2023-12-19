import dayjs from "dayjs";
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

import React from 'react'
import ReactDOM from 'react-dom/client'
import {ThemeProvider} from "./providers/theme/theme_provider";
import {ToastProvider} from "./providers/toast/toast_provider";
import {DialogProvider} from "./providers/dialogProvider/dialogProvider";
import {BrowserRouter} from "react-router-dom";
import {AppRouter} from "./app_router";
import {TooltipProvider} from "./providers/tooltip/TooltipProvider";
import {PopupProvider} from "./providers/popup/PopupProvider";
import {CalendarProvider} from "./providers/calendarContext/CalendarProvider";

import './index.css'
import './base.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <ToastProvider>
                <TooltipProvider>
                    <PopupProvider>
                        <DialogProvider>
                            <BrowserRouter>
                                <CalendarProvider>
                                {/*<QueryClientProvider client={queryClient}>*/}
                                <AppRouter />
                                {/*</QueryClientProvider>*/}
                                </CalendarProvider>
                            </BrowserRouter>
                        </DialogProvider>
                    </PopupProvider>
                </TooltipProvider>
            </ToastProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
