import React, {useState} from 'react';
import {Tooltip} from "../../../components/UI/tooltip/Tooltip";
import {IconButton} from "../../../components/UI/iconButton/IconButton";
import {MagnifyingGlass} from "@phosphor-icons/react";
import {fillOptions} from "../../theme/types";
import classNames from "classnames";
import {Popup} from "../../../components/UI/popup/Popup";
import {Input} from "../../../components/UI/input/Input";
import {useLiveQuery} from "dexie-react-hooks";
import {readAllTaskFromDatabase} from "../../../utils/database/task";
import {SearchBarPopupContent} from "./SearchBarPopupContent";

type props = {}

export const SearchBar = ({}: props) => {
    const [modalTarget, setModalTarget] = useState<DOMRect | undefined>(undefined)
    return (
        <>
            <div className="header-searchbar--wrapper">
                <Tooltip title="search">
                    <IconButton onClick={(e) => setModalTarget(e.currentTarget.getBoundingClientRect())}
                                Icon={MagnifyingGlass} fill={fillOptions.link} enable={false} />
                </Tooltip>
                <Input id="searchbar-input" className={classNames("header-searchbar--input", modalTarget && "open")} />

            </div>
            <Popup target={modalTarget} id={"header-search"} onClose={() => setModalTarget(undefined)}>
                <SearchBarPopupContent />
            </Popup>
        </>
    );
};
