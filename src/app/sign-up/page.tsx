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
import { useState } from "react";

import { usePasswordInput } from "@omergulcicek/password-input"

// import { House, Star } from "lucide-react";

export default function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChangeFn = (value: string, setter: Function) => setter(value);

  const { InputWrapper, wrapperProps, inputProps } = usePasswordInput({
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

  return (
    <Card {...props}>
      <CardHeader className="flex justify-center">
        <Logo />
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(event) => onChangeFn(event.target.value, setFullName)}
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
                  value={password}
                  onChange={(event) => onChangeFn(event.target.value, setPassword)}
                  required
                  {...inputProps}
                />
              </InputWrapper>

            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login" className="text-amber-500">Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
