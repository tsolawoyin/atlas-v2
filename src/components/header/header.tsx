"use client";

import Logo from "../logo";
import { ModeToggle } from "./theme-toggle";

import { useContext } from "react";

import { ShellContext } from "@/shell/shell";

import { Button } from "../ui/button";

export default function Header() {
    const { user, auth: { signOut } } = useContext(ShellContext);

    return user && (
        <div className="px-4 mt-3 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-5">
                <Button onClick={() => signOut()}>S/O</Button>
                <ModeToggle />
            </div>
        </div>
    )
}