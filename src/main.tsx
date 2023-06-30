import React from 'react'
import ReactDOM from 'react-dom/client'
import {ThemeProvider} from "./providers/theme/theme_provider";
import {ToastProvider} from "./providers/toast/toast_provider";
import {DialogProvider} from "./providers/dialogProvider/dialogProvider";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./app_router";

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider forceDarkMode={false}>
            <ToastProvider>
                <DialogProvider>
                    <BrowserRouter>
                        <AppRouter/>
                    </BrowserRouter>
                </DialogProvider>
            </ToastProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
