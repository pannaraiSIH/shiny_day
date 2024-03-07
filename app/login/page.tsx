"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/components/Logo";
import { signIn, useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useAlertStore } from "@/stores/useAlertStore";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(50),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const Page = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const setShowAlert = useAlertStore((state) => state.setShowAlert);
  const setAlertDetails = useAlertStore((state) => state.setAlertDetails);
  const { data: session } = useSession();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isSignIn) {
      try {
        const response = await signIn("credentials", {
          username: values.username,
          password: values.password,
          // callbackUrl: "/",
          redirect: false,
        });

        if (response && response.ok) {
          setTimeout(() => router.push("/"), 4000);

          setAlertDetails({
            title: "Login successful",
            description: null,
            style: "default",
          });
        } else {
          const error = JSON.parse(response?.error || "");

          setAlertDetails({
            title: "Unauthorized",
            description: error.error,
            style: "destructive",
          });
        }
      } catch (error) {
        // console.log(error);

        setAlertDetails({
          title: "Failed to login",
          description: null,
          style: "destructive",
        });
      } finally {
        setShowAlert(true);
      }
    } else {
      const url = "/api/users";
      const response = await axiosInstance.post(url, values);

      if (response && response.status === 201) {
        router.push("/");
      }
    }
  }

  return (
    <main className='h-screen md:grid md:grid-cols-2'>
      <div className='bg-primary'>
        <Logo className='text-muted p-6' />
      </div>
      <div className='h-full flex items-center justify-center bg-primary md:bg-muted'>
        <Card className='max-w-[35rem] w-full mx-6 md:max-w-[30rem]'>
          <CardHeader className='text-xl'>
            <CardTitle className='text-center capitalize'>
              {isSignIn ? "Sign up" : "Login"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder='example' {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='password'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full'>
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex justify-center text-sm text-muted-foreground'>
            <p>{isSignIn ? "Already have an account?" : "New here?"} </p>
            <Button
              variant={"link"}
              className='capitalize'
              // onClick={() => setIsSignIn((prev) => !prev)}
            >
              {isSignIn ? "Sign in" : "Sign up"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Page;
