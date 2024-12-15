import {fetchInstance, ServerResponse} from "./interceptor";
import {ApiEndpoint} from "../constants";

export const getTodolists = async () => {
    const response: TodolistEntity[] = await fetchInstance(ApiEndpoint.GetTodolists)
    return response
}

export const createTodolist = async (title: string): Promise<TodolistEntity> => {
    const response: ServerResponse<CreateTodolistResponse> = await
        fetchInstance(ApiEndpoint.CreateTodolist, {method: 'POST', body: JSON.stringify({title})})
    return response.data.item
}

export const deleteTodolist = async (id: string) => {
    return fetchInstance(`${ApiEndpoint.DeleteTodolist}/${id}`, {method: 'DELETE'})
}

type CreateTodolistResponse = {
    item: TodolistEntity
}

export type TodolistEntity = {
    id: string
    title: string
    addedDate: string
    order: number
}
