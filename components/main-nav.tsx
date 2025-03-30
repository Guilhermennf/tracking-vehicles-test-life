"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Vehicle Tracker</span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard" ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/vehicles"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/vehicles" || pathname.startsWith("/vehicles/")
              ? "text-black dark:text-white"
              : "text-muted-foreground",
          )}
        >
          Vehicles
        </Link>
        <Link
          href="/tracking"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/tracking" ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          Tracking
        </Link>
      </nav>
    </div>
  )
}

