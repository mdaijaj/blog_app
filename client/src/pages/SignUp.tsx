import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Card } from '@/components/ui/card'
import { RouteSignIn } from '@/helpers/RouteName'
import { Link, useNavigate } from 'react-router-dom'
import { getEvn } from '@/helpers/getEnv'
import { showToast } from '@/helpers/showToast'
import GoogleLogin from '@/components/GoogleLogin'

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUp: React.FC = () => {
    const navigate = useNavigate()

    const formSchema = z
    .object({
      name: z.string().min(3, 'Name must be at least 3 characters long.'),
      email: z.string().email(),
      password: z.string().min(8, 'Password must be at least 8 characters long'),
      confirmPassword: z.string(),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          path: ['confirmPassword'], // Attach error to confirmPassword field
          message: 'Password and confirm password should be the same.',
        });
      }
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        try {
            const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/auth/register`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(values)
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }

            navigate(RouteSignIn)
            showToast('success', data.message)
        } catch (error: any) {
            showToast('error', error.message)
        }
    }

    return (
        <div className='flex justify-center items-center h-screen w-screen'>
            <Card className="w-[400px] p-5">
                <h1 className='text-2xl font-bold text-center mb-5'>Create Your Account</h1>
                <div className=''>
                    <GoogleLogin />
                    <div className='border my-5 flex justify-center items-center'>
                        <span className='absolute bg-white text-sm'>Or</span>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}  >
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter password again" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='mt-5'>
                            <Button type="submit" className="w-full">Sign Up</Button>
                            <div className='mt-5 text-sm flex justify-center items-center gap-2'>
                                <p>Already have account?</p>
                                <Link className='text-blue-500 hover:underline' to={RouteSignIn}>Sign In</Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}

export default SignUp