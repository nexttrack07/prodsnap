import { Link } from "@remix-run/react"
import React from "react";

type Props = {
  to: string;
  children: React.ReactNode;
}

export function NavLink({ to, children }: Props) {
  return (
    <Link
      to={to}
      className="inline-block rounded-lg py-1 px-2 text-sm text-slate-100 hover:bg-slate-100 hover:text-blue-700"
    >
      {children}
    </Link>
  )
}
