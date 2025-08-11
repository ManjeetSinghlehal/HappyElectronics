"use server";

import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export default async function saveContact(formData) {
  await connectDB();

  try {
    const newContact = await Contact.create({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      message: formData.get("message"),
    });

    const contactData = JSON.parse(JSON.stringify(newContact.toObject()));

    return { success: true, contact: contactData };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
