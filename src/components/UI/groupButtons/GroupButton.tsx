import React, {ReactNode} from 'react';

import "./groupButton.scss"

type props = {
    children: ReactNode[]
}
const GroupButtonSeparator = () => <div className="group-button--separator"/>

export const GroupButton = ({children}: props) => {
    return (
        <div className="group-button">
            {
                children.reduce((first, second) => (
                    <>
                        {first}
                        <GroupButtonSeparator/>
                        {second}
                    </>
                ))
            }
        </div>
    );
};
