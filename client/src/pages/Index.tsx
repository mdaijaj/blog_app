import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getEvn } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'

interface Blog {
    _id: string;
    title: string;
    // ...other blog properties...
}

interface BlogData {
    blog: Blog[];
}

const Index: React.FC = () => {
    const { data: blogData, loading, error } = useFetch<BlogData>(`${getEvn('VITE_API_BASE_URL')}/blog/blogs`, {
        method: 'get',
        credentials: 'include'
    })
   
    if (loading) return <Loading />
    return (
        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'>
            {blogData && blogData.blog.length > 0
                ?
                blogData.blog.map(blog => <BlogCard key={blog._id} props={blog} />)
                :
                <div>Data Not Found.</div>
            }
        </div>
    )
}

export default Index
