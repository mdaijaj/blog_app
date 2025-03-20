import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import slugify from 'slugify'
import { showToast } from '@/helpers/showToast'
import { getEvn } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import Dropzone from 'react-dropzone'
import Editor from '@/components/Editor'
import { useNavigate } from 'react-router-dom'
import { RouteBlog } from '@/helpers/RouteName'

interface Category {
    _id: string;
    name: string;
}

interface CategoryData {
    category: Category[];
}

const AddBlog: React.FC = () => {
    const navigate = useNavigate()
    const { data: categoryData } = useFetch<CategoryData>(`${getEvn('VITE_API_BASE_URL')}/category/all-category`, {
        method: 'get',
        credentials: 'include'
    })

    const [filePreview, setPreview] = useState<string | undefined>()
    const [file, setFile] = useState<File | undefined>()

    const formSchema = z.object({
        category: z.string().min(3, 'Category must be at least 3 character long.'),
        title: z.string().min(3, 'Title must be at least 3 character long.'),
        slug: z.string().min(3, 'Slug must be at least 3 character long.'),
        blogContent: z.string().min(3, 'Blog content must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            title: '',
            slug: '',
            blogContent: '',
        },
    })

    const handleEditorData = (data: string) => {
        form.setValue("blogContent", data, { shouldValidate: true });
    };

    const blogTitle = form.watch('title')

    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, { lower: true })
            form.setValue('slug', slug)
        }
    }, [blogTitle])

    async function onSubmit(values: any) {
        try {
            const formData = new FormData();
            if (file) formData.append('file', file);
            formData.append('data', JSON.stringify({
                ...values,
                category: values.category
            }));

            const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/blog/add`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                return showToast('error', data.message);
            }

            form.reset();
            setFile(undefined);
            setPreview(undefined);
            navigate(RouteBlog);
            showToast('success', data.message);
        } catch (error: any) {
            showToast('error', error.message);
        }
    }

    const handleFileSelection = (files: File[]) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setFile(file)
        setPreview(preview)
    }

    return (
        <div>
            <Card className="pt-5">
                <CardContent>
                    <h1 className='text-2xl font-bold mb-4'>Add Blog</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}  >
                            <div className="mb-3">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <select
                                                    className="w-full border rounded px-3 py-2"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                >
                                                    <option value="" disabled>Select a category</option>
                                                    {categoryData?.category?.length > 0 ? (
                                                        categoryData.category.map((category) => (
                                                            <option key={category._id} value={category._id.toString()}>
                                                                {category.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No categories available</option>
                                                    )}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter blog title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <span className='mb-2 block'>Featured Image</span>
                                <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <div className='flex justify-center items-center w-36 h-28 border-2 border-dashed rounded'>
                                                {filePreview && <img src={filePreview} alt="Preview" />}
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="blogContent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Blog Content</FormLabel>
                                            <FormControl>
                                                <Editor props={{ initialData: field.value, onChange: handleEditorData }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddBlog
