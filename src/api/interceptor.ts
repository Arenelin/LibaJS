export const fetchInstance = async (url: string) => {
    return fetch(`https://social-network.samuraijs.com/api/1.1/${url}`, {credentials: 'include'})
        .then(r => r.json());
}
