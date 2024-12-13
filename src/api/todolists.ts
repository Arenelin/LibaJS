import {fetchInstance} from "./interceptor";
import {TodolistEntity} from "../Todolists.component";
import {ApiEndpoint} from "../constants";
import {ServerResponse} from "../types";

export const getTodolists = async (): Promise<TodolistEntity[]> => {
    return fetchInstance(ApiEndpoint.GetTodolists)
}

export const createTodolist = async (title: string): Promise<TodolistEntity> => {
    console.log('Sending payload:', JSON.stringify({title}));
    const response: Promise<ServerResponse<CreateTodolistResponse>> =
        fetchInstance(ApiEndpoint.CreateTodolist, {method: 'POST', body: JSON.stringify({title})})
    return response.then(r => r.data.item)
}


type CreateTodolistResponse = {
    item: TodolistEntity
}
