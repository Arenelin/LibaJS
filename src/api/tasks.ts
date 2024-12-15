import {fetchInstance, ServerResponse} from "./interceptor";
import {ApiEndpoint} from "../constants";

export const getTasks = async (todolistId: string): Promise<TaskEntity[]> => {
    const response: GetTasksResponse = await fetchInstance(`/todo-lists/${todolistId}/tasks`)
    return response.items
}

export const createTask = async ({todolistId, title}: CreateTaskParams): Promise<TaskEntity> => {
    const response: ServerResponse<CreateAndUpdateTaskResponse> = await
        fetchInstance(`${ApiEndpoint.CreateTask}/${todolistId}/tasks`,
            {method: 'POST', body: JSON.stringify({title})})
    return response.data.item
}

export const updateTask = async ({todolistId, taskId, model}: UpdateTaskParams) => {
    return fetchInstance(`/todo-lists/${todolistId}/tasks/${taskId}`,
            {method: 'PUT', body: JSON.stringify(model)})
}

export const deleteTask = async ({todolistId, taskId}: DeleteTaskParams) => {
    return fetchInstance(`${ApiEndpoint.DeleteTask}/${todolistId}/tasks/${taskId}`, {method: 'DELETE'})
}

type CreateTaskParams = {
    todolistId: string
    title: string
}

type DeleteTaskParams = {
    todolistId: string
    taskId: string
}

type CreateAndUpdateTaskResponse = {
    item: TaskEntity
}

type GetTasksResponse = {
    error: string | null
    items: TaskEntity[]
    totalCount: number
}

type UpdateTaskParams = {
    todolistId: string
    taskId: string
    model: UpdateTaskModel
}

export type UpdateTaskModel = {
    title: string
    description: string
    status: EnumTaskStatuses
    priority: EnumTaskPriorities
    startDate: string
    deadline: string
}

export const TaskStatuses = {
    New: 0,
    InProgress: 1,
    Completed: 2,
    Draft: 3,
} as const

export const TaskPriorities = {
    Low: 0,
    Middle: 1,
    High: 2,
    Urgently: 3,
    Later: 4,
} as const

export type TaskEntity = {
    description: string
    title: string
    completed: boolean
    status: EnumTaskStatuses
    priority: EnumTaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
};

export type EnumTaskStatuses = (typeof TaskStatuses)[keyof typeof TaskStatuses]
export type EnumTaskPriorities = (typeof TaskPriorities)[keyof typeof TaskPriorities]
