export const fetchInstance = async (url: string, init?: RequestInit) => {
    return fetch(`https://social-network.samuraijs.com/api/1.1${url}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'API-KEY': 'f5774891-4ea7-435a-baf2-3fc2f11fa2bc'
        },
        ...init
    })
        .then(r => r.json());
}
