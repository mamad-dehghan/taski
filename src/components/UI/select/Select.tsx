import {useEffect, useState} from "react";
import {Menu} from "../menu/menu";
import {Button} from "../button/Button";
import {colorOptions, fillOptions} from "../../../providers/theme/types";
import {CaretDown, CaretUp} from "@phosphor-icons/react";
import "./select.scss"

type propT = string | number
type props<T extends propT> = {
    options: {
        name: string,
        value: T
    }[],
    id: string,
    onChange: (value: T) => void,
    initialValue?: T,
    value?: T | null,
    color?: colorOptions.primary | colorOptions.success | colorOptions.error | colorOptions.warning | colorOptions.secondary | colorOptions.tertiary
    fill?: fillOptions,
}

export const Select = <T extends propT>(
    {
        id,
        options,
        onChange,
        initialValue,
        value = null,
        color,
        fill=fillOptions.outline,
    }: props<T>) => {
    const [targetEl, setTargetEl] = useState<DOMRect | undefined>(undefined)
    const [open, setOpen] = useState<boolean>(false)
    const [internalValue, setInternalValue] = useState<T | undefined>(initialValue)
    // useEffect(() => {
    //     // console.log("value changed", value)
    //     if (internalValue)
    //         onChange(internalValue)
    // }, [internalValue]);
    useEffect(() => {
        // null for not changing in value
        if (value !== null)
            setInternalValue(value)
    }, [value]);

    return (
        <>
            <Button
                fill={fill}
                color={color}
                type="button"
                iconSide={"end"}
                icon={open ? <CaretUp /> : <CaretDown />}
                id={id}
                // fill={}
                onClick={(event) => {
                    // console.log(JSON.stringify(event.target.getBoundingClientRect()) === JSON.stringify(event.currentTarget.getBoundingClientRect()))
                    // @ts-ignore
                    setTargetEl(pre => event.target.getBoundingClientRect() ?? pre)
                    setOpen(pre => !pre)
                }}
                className="select">
                <span dir="auto" className="select-content">
                {options.find(item => item.value === internalValue)?.name}
                </span>
            </Button>
            {
                targetEl ?
                    <Menu
                        fitContent
                        hideLeadingIcon
                        compact
                        items={options.map(i => ({
                            title: i.name,
                            onClick: () => {
                                setInternalValue(i.value)
                                setOpen(false)
                                onChange(i.value)
                            }
                        }))}
                        targetEl={targetEl}
                        open={open}
                        onClose={() => setOpen(false)}
                        id={`select-${id}`}
                        className="select-menu"
                        position={[{
                            vertical: "bottom",
                            horizontal: "center"
                        }, {
                            vertical: "top",
                            horizontal: "center"
                        }]}
                    />
                    : undefined
            }
        </>
    );
};
