import React from 'react';
import {Button} from "../../components/UI/button/Button";
import {colorOptions, fillOptions} from "../../providers/theme/types";
import {v4} from "uuid";

const options = [
    {
        name: "fill",
        values: [fillOptions.fill, fillOptions.link, fillOptions.outline, fillOptions.tonal, fillOptions.elevated]
    },
    {
        name: "color",
        values: [colorOptions.error, colorOptions.warning, colorOptions.primary, colorOptions.tertiary, colorOptions.primary, colorOptions.secondary, colorOptions.surface]
    },
    {
        name: "disabled",
        values: [true, false]
    }
]

type props = {}

export const ButtonsPage = ({}: props) => {
    return (
        <div style={{display:"flex",flexFlow:"row wrap", gap:"0.5rem", padding:"1rem"}}>
            {
                options[0].values.map(fill => (
                    options[1].values.map(color => (
                        options[2].values.map(disabled => (
                            <Button key={v4()} fill={fill} color={color} disabled={disabled}>
                                button
                            </Button>
                        ))
                    ))
                ))
            }
        </div>
    );
};

// const create = () => {
//     const k = options
//     for (let i = 0; i < k.length; i++) {
//
//     }
// }
