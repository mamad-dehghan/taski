export type ReminderModel = {
    _id: string | number,
    title: string,
    description?: string,
    time: Date,
    File?: File[] | FileList,
    remindAt: Date,
    tags: string[],
    iterate: any
}
