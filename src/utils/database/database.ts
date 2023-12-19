import Dexie, {Table} from 'dexie';
import {DexieTaskModel} from "../dataModels/task";
import {getCookie} from "typescript-cookie";
import {DexieProfileModel} from "../dataModels/profile";
import {CategoryModel} from "../dataModels/category";

export class TodoDB extends Dexie {
    tasks!: Table<Omit<DexieTaskModel, "id">, number>;
    profile!: Table<DexieProfileModel, number>;
    category!:Table<CategoryModel,string>;

    constructor() {
        super('TodoDB');
        this.version(1).stores({
            tasks: '++id, [startTime+endTime]',
            profile: '++id',
            category:'++title'
        });
        // this.profile.add({preference: "{}", name: "Guest"}, 1)
    }

    // deleteList(todoListId: number) {
    //     return this.transaction('rw', this.tasks, () => {
    //         this.tasks.where({ todoListId }).delete();
    //         // this.todoLists.delete(todoListId);
    //     });
    // }
}

export const db = new TodoDB();
db.on("populate",populate)

async function populate() {
    await db.profile.add({
        name:"Guest",
        preference:"{}",
    })
    // const todoListId = await db.tasks.add({
    //     title: "To Do Today"
    // });
    // await db.tasks.bulkAdd([
    //     {
    //         todoListId,
    //         title: "Feed the birds"
    //     },
    //     {
    //         todoListId,
    //         title: "Watch a movie"
    //     },
    //     {
    //         todoListId,
    //         title: "Have some sleep"
    //     }
    // ]);
}
