import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white dark:bg-black">
      <LoginForm />
    </main>
  )
}

