export const fetchInstance = async (url: string, init?: RequestInit) => {
    const response = await fetch(`https://social-network.samuraijs.com/api/1.1${url}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'API-KEY': 'f5774891-4ea7-435a-baf2-3fc2f11fa2bc'
        },
        ...init
    })
    return response.json()
}

export type ServerResponse<T> = {
    data: T
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}
