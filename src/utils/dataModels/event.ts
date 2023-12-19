export type EventModel = {
    _id: string | number,
    title: string,
    description?: string,
    startTime: Date,
    endTime: Date,
    location?: "location-object",
    Links?: {
        title: string,
        href: string
    }[]
    File?: File[] | FileList,
    tags: string[],
}
