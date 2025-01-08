export const CurrentPage = {
    Todolists: 'todolists',
    Counter: 'counter'
} as const

export type EnumCurrentPage = (typeof CurrentPage)[keyof typeof CurrentPage]


export const Item = {
    Todolist: 'todolist',
    Task: 'task'
} as const

export type EnumItem = (typeof Item)[keyof typeof Item]


export const TaskFilter = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
} as const

export type EnumTaskFilter = (typeof TaskFilter)[keyof typeof TaskFilter]


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

export type EnumTaskStatuses = (typeof TaskStatuses)[keyof typeof TaskStatuses]
export type EnumTaskPriorities = (typeof TaskPriorities)[keyof typeof TaskPriorities]
