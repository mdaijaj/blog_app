import { useEffect, useState } from "react"

interface FetchOptions extends RequestInit {}

export const useFetch = <T,>(url: string, options: FetchOptions = {}, dependencies: any[] = []) => {
    const [data, setData] = useState<T | undefined>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | undefined>()

    useEffect(() => {
        const fetData = async () => {
            setLoading(true)
            try {
                const response = await fetch(url, options)
                const responseData = await response.json()
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}, ${response.status}`)
                }

                setData(responseData)
                setError(undefined)
            } catch (error) {
                setError(error as Error)
            } finally {
                setLoading(false)
            }
        }
        fetData()
    }, dependencies)

    return { data, loading, error }
}
