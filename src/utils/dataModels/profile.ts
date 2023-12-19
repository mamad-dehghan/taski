export type ProfileModel = {
    name: string,
    email: string,
    image?: File,
    preference: "preference-object"
}
export type DexieProfileModel = {
    name: string,
    email?: string,
    image?: string,
    preference: string
}
