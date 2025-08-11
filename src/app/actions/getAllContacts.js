"use server";

import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export default async function getAllContacts() {
  await connectDB();
  return await Contact.find().sort({ createdAt: -1 });
}