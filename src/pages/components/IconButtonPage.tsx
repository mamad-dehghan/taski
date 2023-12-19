import React from 'react';
import {colorOptions, fillOptions} from "../../providers/theme/types";
import {Button} from "../../components/UI/button/Button";
import {v4} from "uuid";
import {IconButton} from "../../components/UI/iconButton/IconButton";
import {Aperture} from "@phosphor-icons/react";

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
    },
    {
        name:"enabled",
        values: [true, false]
    },
    {
        name: "weight",
        values: ["regular", "fill"]
    }
]

type props = {}

export const IconButtonPage = ({}: props) => {
    return (
        <div style={{display:"flex",flexFlow:"row wrap", gap:"0.5rem", padding:"1rem"}}>
            {
                options[0].values.map(fill => (
                    options[1].values.map(color => (
                        options[2].values.map(disabled => (
                        options[3].values.map(enable => (
                        options[4].values.map(weight => (
                            <IconButton key={v4()} enable={enable} weight={weight} fill={fill} color={color} disabled={disabled} Icon={Aperture}>
                                button
                            </IconButton>
                        ))
                        ))
                        ))
                    ))
                ))
            }
        </div>
    );
};
