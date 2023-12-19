import {CategoryModel} from "../dataModels/category";
import {db} from "./database";

export const createCategory = (category: CategoryModel) => {
    db.category.add(category)
}

export const readCategory = async (title:string): Promise<CategoryModel> => {
    const category = await db.category.where("title").equals(title).toArray()
    return category[0]
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
