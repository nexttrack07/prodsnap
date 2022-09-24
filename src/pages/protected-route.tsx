import { UserCredential } from "firebase/auth"
import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  user: UserCredential["user"] | null;
  redirectPath?: string;
  children: JSX.Element;
}

export function ProtectedRoute({
  user,
  redirectPath = '/login',
  children
}: Props) {
  if (!user) {
    return <Navigate to={redirectPath} replace />
  }

  return children;
}