export const deleteData = async (endpoint: string): Promise<boolean> => {
    const c = confirm('Are you sure to delete this data?')
    if (c) {
        try {
            const response: Response = await fetch(endpoint, {
                method: 'delete',
                credentials: 'include'
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    } else {
        return false
    }
}
