import React, { useState } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { RouteSearch } from '@/helpers/RouteName'

const SearchBox: React.FC = () => {
    const navigate = useNavigate()
    const [query, setQuery] = useState<string>()
    const getInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate(RouteSearch(query))
    }
    return (
        <form onSubmit={handleSubmit}>
            <Input name="q" onInput={getInput} placeholder="Search here..." className="h-9 rounded-full bg-gray-50" />
        </form>
    )
}

export default SearchBox
