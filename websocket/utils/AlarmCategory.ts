import categories from "../../pikud_data/alertCategories.json"
import remainderConfig from "../../pikud_data/RemainderConfig_eng.json";
import {AlarmCategory} from "../interfaces/Alarm";

export function getCategoryById(categoryId: number): AlarmCategory {
    return categories.filter(category => category.id === categoryId)[0] as AlarmCategory
}

export function getFancyCategoryName(categoryName: string): string {
    const categoryPresent = remainderConfig.filter(category => category.cat === categoryName)

    if (categoryPresent) {
        return categoryPresent[0].title;
    }

    switch(categoryName) {
        case "nonconventional":
            return "Nonconventional Attack";
        case "warning":
            return "Warning Issued by HFC";
        case "memorialday1":
            return "Memorial Day"
        case "memorialday2":
            return "Memorial Day"
        default:
            return categoryName;
    }
}