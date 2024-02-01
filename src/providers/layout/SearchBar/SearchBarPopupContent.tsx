import React, {useMemo, useState} from "react";
import {useLiveQuery} from "dexie-react-hooks";
import {readAllTaskFromDatabase} from "../../../utils/database/task";
import {Tooltip} from "../../../components/UI/tooltip/Tooltip";
import {IconButton} from "../../../components/UI/iconButton/IconButton";
import {MagnifyingGlass} from "@phosphor-icons/react";
import {fillOptions} from "../../theme/types";
import {Input} from "../../../components/UI/input/Input";
import "./searchBarPopupContent.scss";
import {DexieTaskModel} from "../../../utils/dataModels/task";
import {readAllCategories} from "../../../utils/database/category";
import {CategoryModel} from "../../../utils/dataModels/category";

export const SearchBarPopupContent = () => {
    const [inputValue, setInputValue] = useState<string>("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<CategoryModel[]>([])
    const allCategories = useLiveQuery<CategoryModel[]>(readAllCategories) ?? []
    const allTasks = useLiveQuery<DexieTaskModel[]>(() => readAllTaskFromDatabase()) ?? []
    const allTags = useMemo(() =>
        new Set<string>(
            allTasks.map(task => task.tags?.split(',').filter(Boolean) ?? []).flat(1)
        ), [allTasks])
    console.log(
        inputValue,
        allTags,
        allCategories,
        allTasks
    )
    // .then(tasks => tasks.filter(task => (
    //     task.title.includes(inputValue) ||
    //     task.description?.includes(inputValue) ||
    //     task.tags?.includes(inputValue))
    // )))
    const filteredTasks = useMemo(() => {
        return allTasks.filter(task => (
            task.title.includes(inputValue) ||
            task.description?.includes(inputValue) ||
            task.tags?.includes(inputValue)))
            .filter(task => selectedCategories.length === 0 ? true : selectedCategories.some(cat => cat.id === task.id))
            .filter(task => selectedTags.length === 0 ? true : selectedTags.some(tag => task.tags?.includes(tag)))
    }, [inputValue, selectedTags, selectedCategories, allTasks]);

    return (
        <div className="searchbar--popup">
            <div className="searchbar--popup--top">
                <Tooltip title="search">
                    <IconButton
                        // onClick={(e)=>setModalTarget(e.currentTarget.getBoundingClientRect())}
                        Icon={MagnifyingGlass} fill={fillOptions.link} enable={false} />
                </Tooltip>
                <Input id="searchbar-input" onChange={(e) => setInputValue(e.currentTarget.value)} />
            </div>
            <div className="searchbar--popup--tag-section">

            </div>
            <div className="searchbar--popup--category-section">

            </div>

        </div>
    )
}
