import {fetchInstance} from "./interceptor";
import {TodolistEntity} from "../Todolists.component";
import {ApiEndpoint} from "../constants";

export const getTodolists = async (): Promise<TodolistEntity[]> => {
    return fetchInstance(ApiEndpoint.GetTodolists)
}

export const createTodolist = async (title: string): Promise<any> => {
    return fetchInstance(ApiEndpoint.CreateTodolist, {method: 'POST', body: title})
}
