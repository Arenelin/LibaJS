import {fetchInstance} from "./interceptor";
import {TaskEntity} from "../Todolist.component";
import {ApiEndpoint} from "../constants";
import {ServerResponse} from "../types";

export const getTasks = async (todolistId: string): Promise<TaskEntity[]> => {
    const response: Promise<GetTasksResponse> =  fetchInstance(`/todo-lists/${todolistId}/tasks`)
    return response.then(r=> r.items)
}

export const createTask = async ({todolistId, title}: CreateTaskParams): Promise<TaskEntity> => {
    console.log('Sending payload:', JSON.stringify({title}));
    const response: Promise<ServerResponse<CreateTaskResponse>> =
        fetchInstance(`${ApiEndpoint.CreateTask}/${todolistId}/tasks`,
            {method: 'POST', body: JSON.stringify({title})})
    return response.then(r => r.data.item)
}

type CreateTaskParams = {
    todolistId: string
    title: string
}

type CreateTaskResponse = {
    item: TaskEntity
}

type GetTasksResponse = {
    error: string | null
    items: TaskEntity[]
    totalCount: number
}
