"use server";

import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export default async function fetchContacts() {
  await connectDB();

  const contacts = await Contact.find().sort({ createdAt: -1 });

  return contacts.map((c) => ({
    id: c._id.toString(),
    name: c.fullName,
    email: c.email,
    message: c.message,
    createdAt: c.createdAt.toISOString(),
  }));
}
