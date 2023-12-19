import {useState} from "react";
import './sidebarItem.scss'
import {Icon} from "@phosphor-icons/react";
import {Badge} from "../badge/Badge";

type props = {
    name: string,
    Icon: Icon
}

export const SidebarItem = ({name, Icon}: props) => {
    const [isActive, setIsActive] = useState<boolean>(false)
    return (
        <a tabIndex={0} className={`sidebar-item open ${isActive ? "active" : ""}`}
           onClick={() => setIsActive(prevState => !prevState)}
        >
            <Badge show={true} display={"number"} value={47}>
                <Icon size={24} weight={isActive ? 'fill' : 'regular'}/>
            </Badge>
            <p className="sidebar-item--label">{name}</p>
        </a>
    )
}
