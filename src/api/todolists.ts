import {fetchInstance} from "./interceptor";
import {TodolistEntity} from "../Todolists.component";

export const getTodolists = async (): Promise<TodolistEntity[]> => {
    return fetchInstance('/todo-lists')
}
