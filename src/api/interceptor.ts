export const fetchInstance = async (url: string, init?: RequestInit) => {
    return fetch(`https://social-network.samuraijs.com/api/1.1${url}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        ...init
    })
        .then(r => r.json());
}
