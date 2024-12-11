import {fetchInstance} from "./interceptor";
import {TaskEntity} from "../Todolist.component";

export const getTasks = async (todolistId: string): Promise<TaskEntity[]> => {
    return fetchInstance(`/todo-lists${todolistId}/tasks`)
}
