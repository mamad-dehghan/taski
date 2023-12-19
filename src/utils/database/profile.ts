import {DexieProfileModel, ProfileModel} from "../dataModels/profile";
import {db} from "./database";

// const convertToDexieProfileModel = ({image, preference, ...profile}: ProfileModel): DexieProfileModel => {
//     //     const reader = new FileReader();
//     // if (image) {
//     //
//     //     reader.onloadend = function () {
//     //         console.log('RESULT', reader.result)
//     //     }
//     //     reader.readAsDataURL(image);
//     // }
//     // console.log(reader)
//
//     return {
//         ...profile,
//         // image:undefined,
//         preference: ""
//         // image:image ? reader:undefined,
//
//     }
// }

export const createProfile = (profile: Omit<DexieProfileModel, "id">) => {
    db.profile.add(profile, 1)
}

export const readProfile = async (): Promise<DexieProfileModel & { id: number }> => {
    const profile = await db.profile.toArray()
    return {id:1,...profile[0]}
}

export const updateProfile = async (profile: Partial<Omit<DexieProfileModel, "id">>) => {
    const oldProfile = await readProfile()
    // console.log(oldProfile)
    db.profile.update(oldProfile.id, profile)
}
