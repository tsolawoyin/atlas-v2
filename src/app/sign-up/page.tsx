"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import Logo from "@/components/logo";

import Link from "next/link";
import { useState, useContext, useTransition } from "react";

import { usePasswordInput } from "@omergulcicek/password-input"

import { ShellContext } from "@/shell/shell";

// import { House, Star } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { AlertCircleIcon } from "lucide-react";

// The only thing remaining is to sanitize input
// Users can be crazy.
export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState(null)

  const { auth: { signUp } } = useContext(ShellContext);

  const onChangeFn = (value: string, setter: Function) => setter(value);

  const { InputWrapper, wrapperProps, inputProps, value, setValue } = usePasswordInput({
    password: {
      icons: {
        show: <span className="text-xs">Show</span>,
        hide: <span className="text-xs">Hide</span>,
      }
    },
    classNames: {
      suffix: "my-custom-suffix",     // right-side icon container
      button: "dark:bg-neutral-800"    // toggle button element
    }
  });

  const signUpHelper = () => {
    const credentials = {
      email,
      password: value,
      options: {
        data: {
          username,
          fullName
          // I can add/remove more field as needed later on. Nice one.
        }
      }
    }

    startTransition(async () => {
      try {
        // console.log(credentials)
        await signUp(credentials);
      } catch (error: any) {
        setError(error.message);
      }
    })
  }

  return (
    <Card>
      <CardHeader className="flex justify-center">
        <Logo />
      </CardHeader>
      <CardContent>
        <form action={signUpHelper}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                className=""
                placeholder="John Doe"
                value={fullName}
                onChange={(event) => onChangeFn(event.target.value, setFullName)}
                pattern="[a-zA-Z\s]{3,}"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Username</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(event) => onChangeFn(event.target.value, setUsername)}
                pattern="[a-zA-Z\s\d]{3,}"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(event) => onChangeFn(event.target.value, setEmail)}
                required
              />
              {/* <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <InputWrapper {...wrapperProps}>
                <Input
                  id="password"
                  type="password"
                  value={value}
                  // onChange={(event) => onChangeFn(event.target.value, setValue)}
                  required
                  {...inputProps}
                />
              </InputWrapper>

            </Field>
            <FieldGroup>
              <Field>
                <Button className="w-full flex items-center gap-2">
                  {isPending && <Spinner />}
                  Create Account
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login" className="text-amber-500">Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
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
      </CardContent>
    </Card>
  );
}
