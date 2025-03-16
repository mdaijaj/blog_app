import React, { useState } from 'react'
import { FaComments } from "react-icons/fa";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { showToast } from '@/helpers/showToast';
import { getEvn } from '@/helpers/getEnv';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useSelector } from 'react-redux';
import { RouteSignIn } from '@/helpers/RouteName';
import CommentList from './CommentList';
import { Link } from 'react-router-dom';

interface CommentProps {
    props: {
        blogid: string;
    }
}

const Comment: React.FC<CommentProps> = ({ props }) => {
    const [newComment, setNewComment] = useState<any>()
    const user = useSelector((state: any) => state.user)
    const formSchema = z.object({
        comment: z.string().min(3, 'Comment must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: '',
        },
    })

    async function onSubmit(values: any) {
        try {
            const newValues = { ...values, blogid: props.blogid, user: user.user._id }
            const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/comment/add`, {
                method: 'post',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(newValues)
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            setNewComment(data.comment)
            form.reset()
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <div>
            <h4 className='flex items-center gap-2 text-2xl font-bold'> <FaComments className='text-violet-500' /> Comment</h4>

            {user && user.isLoggedIn
                ?
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}  >
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comment</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type your comment..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" >Submit</Button>
                    </form>
                </Form>
                :
                <Button asChild>
                    <Link to={RouteSignIn}>Sign In </Link>
                </Button>
            }

            <div className='mt-5'>
                <CommentList props={{ blogid: props.blogid, newComment }} />
            </div>

        </div>
    )
}

export default Comment
