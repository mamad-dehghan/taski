import {ReminderModel} from "./reminder";
import {TaskModel} from "./task";
import {EventModel} from "./event";
import {ProfileModel} from "./profile";
import {CategoryModel} from "./category";

export type UserModel = {
    _id: string | number,
    _cookie: string,
    reminders: ReminderModel[],
    tasks: TaskModel[],
    events: EventModel[],
    categories: CategoryModel[],
    profile: ProfileModel,
}
