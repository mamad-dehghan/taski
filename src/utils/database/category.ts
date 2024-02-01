import {CategoryModel} from "../dataModels/category";
import {db} from "./database";

export const createCategory = async (category: Omit<CategoryModel, "id">) => {
    console.log(category)
    const existCategory = await readCategory(category.title)
    if (existCategory)
        throw new Error("Another category with this title exist")
    //@ts-ignore
    return db.category.add({...category})
}

export const readCategory = async (title: string): Promise<CategoryModel | undefined> => {
    const category = await db.category.where("title").equals(title).first()
    console.log(category)
    return category
}


export const readCategoryById = async (id?: number): Promise<CategoryModel | undefined> => {
    if (!id)
        return undefined
    const category = await readAllCategories()
    return category.find(cat => cat.id === id)
}

export const readAllCategories = async (): Promise<CategoryModel[]> => {
    const categories = await db.category.toArray()
    return categories
}

// export const updateCategory = async (category: Partial<CategoryModel> & {title:string}) => {
//     const oldCategory = await readCategory()
//     console.log(oldCategory)
//     db.category.update(oldCategory.id, category)
// }
// TODO: update task with this category
export const deleteCategory = (id: number) => {
    return db.category.delete(id)
}
