"use client";

// Components
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import Link from "next/link"

import Logo from "@/components/logo"

// Hooks
import { useState, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";

// Context
import { ShellContext } from "@/shell/shell";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { auth: { login } } = useContext(ShellContext);

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState(null);

    const loginUser = () => {
        startTransition(async () => {
            try {
                setError(null);
                await login({
                    email, password
                })
            } catch (error: any) {
                setError(error.message);
            }
        })
    }

    return (
        <form action={loginUser} className="grid gap-3">
            <Card className="w-full max-w-sm m-auto">
                <CardHeader>
                    <CardTitle className="text-center"><Logo /></CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(ev) => {
                                    setEmail(ev.target.value);
                                }}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(ev) => {
                                    setPassword(ev.target.value);
                                }} required />
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex-col gap-6">
                    <Button className="w-full flex items-center gap-2">
                        {isPending && <Spinner />}
                        Login
                    </Button>
                    <p className="">New here? <Link href={"/sign-up"} className="text-amber-500">Create a free account</Link></p>
                </CardFooter>
            </Card>

            {error && (
                <div className="grid w-full max-w-xl items-start gap-4">
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Error!</AlertTitle>
                        <AlertDescription>
                            <p>{error}</p>
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </form>
    )
}
