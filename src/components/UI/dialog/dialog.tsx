import React, {ReactNode} from 'react';

import './dialog.scss'

type props = {
    children: ReactNode | any;
}

export const Dialog = ({children}: props) => {
    return (
        <div className="dialog">
            {children}
        </div>
    );
};

type titleProps = {
    children: ReactNode
}

Dialog.Title = ({children}: titleProps) => {
    return (
        <div className="dialog-header">
            {children}
        </div>
    )
}

type helpTextProps = {
    children: ReactNode
}

Dialog.HelpText = ({children}: helpTextProps) => {
    return (
        <div className="dialog-help-text">
            {children}
        </div>
    )
}

type bodyProps = {
    children: ReactNode
}

Dialog.Body = ({children}: bodyProps) => {
    return (
        <div className="dialog-body">
            {children}
        </div>
    )
}

type actionProps = {
    children: ReactNode
}

Dialog.Actions = ({children}: actionProps) => {
    return (
        <div className="dialog-actions">
            {children}
        </div>
    )
}
