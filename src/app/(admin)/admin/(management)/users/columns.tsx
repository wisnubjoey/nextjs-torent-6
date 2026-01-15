"use client"

import { ColumnDef } from "@tanstack/react-table"

export type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: Date | null
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "emailVerified",
    header: "Verified",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "banned",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
]
