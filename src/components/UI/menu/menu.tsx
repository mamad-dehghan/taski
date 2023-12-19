import React, {MouseEventHandler, useState} from 'react';
import classNames from "classnames";
import {Divider} from "../divider/Divider";
import {CaretRight, Icon} from "@phosphor-icons/react";
import {MenuItem} from "./menuItem";
import {marginsT, positionType} from "../../../utils/placeFinder/placeFinder";
import "./menu.scss"
import {Popup} from "../popup/Popup";

type actionListItemType = {
    type?: "action",
    title: string,
    leadingIcon?: Icon,
    trailingIcon?: Icon,
    onClick: MouseEventHandler<HTMLButtonElement>,
}

type nestedListItemType = {
    type: "nested",
    title: string,
    leadingIcon?: Icon,
    trailingIcon?: Icon,
    subMenu: list[],
}

type list = actionListItemType | nestedListItemType | "separator"

type props = {
    id: string,
    hideLeadingIcon?: boolean, // add hide , show, auto
    className?: string,
    fitContent?: boolean,
    compact?: boolean,
    onClose: () => void,
    items: list[],
    // parentId?: string,
    targetEl: DOMRect,
    open: boolean,
    position?: positionType,
    margins?: marginsT,
}

// TODO: add hover open sub menu mode
// TODO: add grouping

export const Menu = React.memo((
    {
        fitContent,
        items,
        hideLeadingIcon,
        className,
        compact,
        targetEl,
        onClose,
        id,
        open,
        position,
        margins,
    }: props) => {
    // const {hidePopup, showPopup} = usePopup()
    // useEffect(() => {
    //     if (open) {
    //         showPopup(
    //             {
    //                 id,
    //                 targetEl: targetEl,
    //                 onClose,
    //                 position,
    //                 content:
    //                     <div className={classNames(
    //                         "menu scroller",
    //                         fitContent && "fit-content",
    //                         compact && "compact",
    //                         hideLeadingIcon && "hide-leading-icons",
    //                         className
    //                     )}
    //                          onClick={event => {
    //                              event.stopPropagation()
    //                          }}
    //                     >
    //                         {items.map((item, index) => {
    //                             if (item === "separator")
    //                                 return <Divider key={"divider" + index} type="fullWidth" />
    //                             else if (item.type === "nested")
    //                                 return (
    //                                     <NestedMenuItem key={item.title}
    //                                                     item={item}
    //                                                     parentId={id}
    //                                                     compact={compact}
    //                                                     fitContent={fitContent}
    //                                                     hideLeadingIcon={hideLeadingIcon}
    //                                                     className={className} />
    //                                 )
    //                             else
    //                                 return <MenuItem
    //                                     key={item.title}
    //                                     title={item.title}
    //                                     onClick={item?.onClick ?? onClose}
    //                                     TrailingIcon={item.trailingIcon}
    //                                     LeadingIcon={item.leadingIcon}
    //                                 />
    //                         })}
    //                     </div>
    //             },
    //             parentId
    //         )
    //     } else {
    //         hidePopup(id)
    //     }
    // }, [id, open]);
    // return <></>
    // console.log()

    return (
        <Popup
            id={"--menu-" + id}
            open={open}
            position={position}
            margins={margins}
            onClose={onClose}
            target={targetEl}>
            <div className={classNames(
                "menu scroller",
                fitContent && "fit-content",
                compact && "compact",
                hideLeadingIcon && "hide-leading-icons",
                className
            )}
                // onClick={event => {
                //     event.stopPropagation()
                // }}
            >
                {items.map((item, index) => {
                    if (item === "separator")
                        return <Divider key={"divider" + index} type="fullWidth" />
                    else if (item.type === "nested")
                        return (
                            <NestedMenuItem key={item.title}
                                            item={item}
                                            // parentId={id}
                                            compact={compact}
                                            fitContent={fitContent}
                                            hideLeadingIcon={hideLeadingIcon}
                                            className={className} />
                        )
                    else
                        return <MenuItem
                            key={item.title}
                            title={item.title}
                            onClick={item?.onClick ?? onClose}
                            TrailingIcon={item.trailingIcon}
                            LeadingIcon={item.leadingIcon}
                        />
                })}
            </div>
        </Popup>
    )

}, (a, b) => a.open === b.open && a.id === b.id);

type nestedMenuItemType = {
    item: nestedListItemType,
    hideLeadingIcon?: boolean,
    className?: string,
    fitContent?: boolean,
    compact?: boolean,
    // parentId: string
}
const NestedMenuItem = React.memo(({item, ...props}: nestedMenuItemType) => {
    const [state, setState] = useState<{ open: false, targetEl: undefined } | {
        open: boolean,
        targetEl: DOMRect
    }>({open: false, targetEl: undefined})
    return (
        <>
            <MenuItem
                className={state.open ? "element-focused" : undefined}
                key={item.title}
                LeadingIcon={item.leadingIcon}
                title={item.title}
                TrailingIcon={CaretRight}
                onClick={(event) => {
                    // event.stopPropagation()
                    console.log(event.currentTarget.getBoundingClientRect())
                    setState(prevState => ({
                        open: !prevState.open,
                        targetEl: prevState.targetEl ?? event.currentTarget.getBoundingClientRect()
                    }))
                }}
            />
            {
                state.targetEl
                    ? <Menu
                        id={item.title}
                        open={state.open}
                        onClose={() => setState(prevState => ({...prevState, open: false}))}
                        items={item.subMenu}
                        targetEl={state.targetEl}
                        position={[{vertical: "bottom", horizontal: "right"}, {vertical: "bottom", horizontal: "left"},]}
                        margins={{
                                    targetEl: {X: 0, Y: -8 - state.targetEl.height},
                                    container: {X: 4, Y: 4}
                                }}
                        {...props}
                    />
                    : <></>
            }
        </>
    )
})
