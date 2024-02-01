import Dexie, {Table} from 'dexie';
import {DexieTaskModel, TaskModel} from "../dataModels/task";
import {getCookie} from "typescript-cookie";
import {DexieProfileModel} from "../dataModels/profile";
import {CategoryModel} from "../dataModels/category";

type SampleDataType={
    profile:DexieProfileModel,
    categories:CategoryModel[],
    tasks:DexieTaskModel[],
}

enum Time{
    minute=60000,
    hour=3600000,
    day=86400000,
    week=604800000,
    month=2592000000,
}

const sampleData:SampleDataType = {
    profile:{name:"Guest",preference:'{}',},
    categories:[
        {id:1,title:"work",color:"#138433",description:"for work"},
        {id:2,title:"business",color:"#138433",description:"for work"},
        {id:3,title:"school",color:"#138433",description:"for work"},
    ],
    tasks:[
        {id:1, title:"sample task 1", startTime:Date.now()-(2*Time.week),endTime:Date.now()-(2*Time.week-3*Time.hour),priority:"high",isDone:true,isAllDay:false,description:"",File:undefined,tags:""},
        {id:2, title:"homework", startTime:Date.now()-(2*Time.week+4*Time.day),endTime:Date.now()-(2*Time.week+4*Time.day-Time.hour-14*Time.minute),priority:"medium",isDone:false,isAllDay:true, categoryId:1,description:"",File:undefined,tags:""},
        {id:3, title:"database", startTime:Date.now()-(9*Time.day+7*Time.hour+39*Time.minute),endTime:Date.now()-(9*Time.day+7*Time.hour+12*Time.minute),priority:"high",isDone:true,isAllDay:false, categoryId:2,description:"",File:undefined,tags:""},
        {id:4, title:"UI/UX", startTime:Date.now(),endTime:Date.now()+(2*Time.hour+9*Time.minute),priority:"low",isDone:false,isAllDay:false, categoryId:1,description:"",File:undefined,tags:""},
        {id:5, title:"frontend", startTime:Date.now()+(Time.week-5*Time.hour-18*Time.minute),endTime:Date.now()+(Time.week-3*Time.hour+24*Time.minute),priority:"low",isDone:false,isAllDay:false, categoryId:3,description:"",File:undefined,tags:""},
        // {id:6, title:"backend", startTime:Date.now(),endTime:Date.now(),priority:"high",isDone:false,isAllDay:false},
        // {id:7, title:"devops", startTime:Date.now(),endTime:Date.now(),priority:"high",isDone:false,isAllDay:false},
    ]
}

export class TodoDB extends Dexie {
    tasks!: Table<Omit<DexieTaskModel, "id">, number>;
    profile!: Table<DexieProfileModel, number>;
    category!:Table<CategoryModel,number>;

    constructor() {
        super('TodoDB');
        this.version(1).stores({
            tasks: '++id, [startTime+endTime]',
            profile: '++id',
            category:'++id, title'
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
    await db.profile.add(sampleData.profile)
    sampleData.categories.forEach(async category=>{
        await db.category.add(category)
    })
    sampleData.tasks.forEach(async task=>{
        await db.tasks.add(task)
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
