"use client"

import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { OctagonAlertIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaGithub, FaGoogle } from "react-icons/fa"
import z from "zod"

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm Password is required")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

export const SignUpView = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null)

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/"
      },
      {
        onSuccess: () => {
          setError(null)
          router.push("/")
        },
        onError: ({ error }) => {
          setError(error.message)
        }
      }
    )
  }

  const loginSocial = (provider: "google" | "github") => {
    setError(null)

    authClient.signIn.social(
      {
        provider,
        callbackURL: "/"
      },
      {
        onSuccess: () => {
          setError(null)
        },
        onError: ({ error }) => {
          setError(error.message)
        }
      }
    )
  }

  const isDisabled = !form.formState.isValid

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Let&apos;s get started</h1>
                  <p className="text-muted from-foreground text-balance">Create an account to continue</p>
                </div>

                {/* Name field */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel htmlFor="name" className="font-medium">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input id="name" type="text" placeholder="Alex Douglas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email field */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel htmlFor="email" className="font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input id="email" type="email" placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password field */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel htmlFor="password" className="font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input id="password" type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Confirm Password field */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel htmlFor="confirmPassword" className="font-medium">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input id="confirmPassword" type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="size-4 text-destructive" />
                    <AlertTitle className="text-destructive">{error}</AlertTitle>
                  </Alert>
                )}

                <Button disabled={isDisabled} type="submit" className="w-full">
                  Sign Up
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
                </div>
                <div className="grid-cols-2 grid gap-4">
                  {/* Social login buttons can go here */}
                  <Button variant="outline" className="w-full" onClick={() => loginSocial("google")}>
                    <FaGoogle />
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => loginSocial("github")}>
                    <FaGithub />
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="underline underline-offset-4">
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <Image src="/logo.svg" alt="Logo" width={150} height={50} />
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  )
}
