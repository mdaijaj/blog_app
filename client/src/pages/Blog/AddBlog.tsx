import React, { useEffect, useState } from 'react';
import { Form, FormControl, FormField as RHFFormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Rename import to avoid conflict
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerProps, Controller } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import slugify from 'slugify';
import { showToast } from '@/helpers/showToast';
import { getEvn } from '@/helpers/getEnv';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFetch } from '@/hooks/useFetch';
import Dropzone from 'react-dropzone';
import Editor from '@/components/Editor';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RouteBlog } from '@/helpers/RouteName';

// Define the form schema type
const formSchema = z.object({
    category: z.string().min(3, 'Category must be at least 3 character long.'),
    title: z.string().min(3, 'Title must be at least 3 character long.'),
    slug: z.string().min(3, 'Slug must be at least 3 character long.'),
    blogContent: z.string().min(3, 'Blog content must be at least 3 character long.'),
});

// Define the type for the form values
type FormValues = z.infer<typeof formSchema>;

const FormField: React.FC<ControllerProps> = (props) => {
    return (
        <FormItem>
            <FormLabel>{props.name}</FormLabel>
            <FormControl>
                <Controller {...props} />
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

const AddBlog = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user);  // Specify type for state
    const { data: categoryData, loading, error } = useFetch(`${getEvn('VITE_API_BASE_URL')}/category/all-category`, {
        method: 'get',
        credentials: 'include'
    });

    const [filePreview, setPreview] = useState<string | undefined>(); // Type the state as string or undefined
    const [file, setFile] = useState<File | undefined>(); // Type the state as File or undefined
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({ // Specify the type for useForm
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            title: '',
            slug: '',
            blogContent: '',
        },
    });

    const handleEditorData = (event: any, editor: any) => { // Specify type for event and editor
        const data = editor.getData();
        form.setValue('blogContent', data);
    };

    const blogTitle = form.watch('title');

    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, { lower: true });
            form.setValue('slug', slug);
        }
    }, [blogTitle, form]);

    async function onSubmit(values: FormValues) { // Specify the type for values

        try {
            setIsSubmitting(true);
            const newValues = { ...values, author: user.user._id };
            if (!file) {
                showToast('error', 'Feature image required.');
                return; // Stop the submission if no file
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('data', JSON.stringify(newValues));

            const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/blog/add`, {
                method: 'post',
                credentials: 'include',
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                showToast('error', data.message);
                return; // Stop the submission on error
            }
            form.reset();
            setFile(undefined); // Reset file state
            setPreview(undefined); // Reset preview state
            navigate(RouteBlog);
            showToast('success', data.message);
        } catch (error: any) { // Specify type for error
            showToast('error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleFileSelection = (files: File[]) => { // Specify type for files
        const file = files[0];
        const preview = URL.createObjectURL(file);
        setFile(file);
        setPreview(preview);
    };

    return (
        <div>
            <Card className="pt-5">
                <CardContent>
                    <h1 className='text-2xl font-bold mb-4'>Edit Blog</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}  >
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger  >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categoryData && categoryData.category.length > 0 ? (
                                                            categoryData.category.map((category: { _id: string; name: string }) => (
                                                                <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="">No Categories</SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
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
                                        <div {...getRootProps()} style={{ cursor: 'pointer' }}>
                                            <input {...getInputProps()} />
                                            <div className='flex justify-center items-center w-36 h-28 border-2 border-dashed rounded'>
                                                {filePreview ? (
                                                    <img src={filePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                                ) : (
                                                    <span>Drag 'n' drop or click to select file</span>
                                                )}
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
                                                <Editor props={{ initialData: '', onChange: handleEditorData }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddBlog;