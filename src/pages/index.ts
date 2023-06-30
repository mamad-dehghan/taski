import {ReactElement} from "react";
import {Setting} from "./setting/setting";

export const pages: { component: () => ReactElement, name: string, path: string }[] = [
    // {
    //     component: (<></>),
    //     name: "Groups",
    //     path: "/dashboard/groups",
    // },
    // {
    //     component: Pages.users,
    //     name: "Users",
    //     path: "/dashboard/users"
    // }
    {
        name: "setting",
        path: "/dashboard/setting",
        component: Setting
    }

]
