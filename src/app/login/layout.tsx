export const metadata = {
    title: "Enter Atlas",
    description: "Atlas Login Page"
}

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="p-4">{children}</div>
    )
}