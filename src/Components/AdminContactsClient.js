"use client";

import { useEffect, useState } from "react";
import fetchContacts from "@/app/actions/fetchContacts";

export default function AdminContactsClient({ initialContacts }) {
  const [contacts, setContacts] = useState(initialContacts);

  useEffect(() => {
    const refresh = async () => {
      const updated = await fetchContacts();
      setContacts(updated);
    };
    refresh();
  }, []);

  return (
    <main className="container py-5">
      <h2 className="text-center mb-4">Contact Messages</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No messages yet.
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-decoration-none text-primary"
                    >
                      {c.email}
                    </a>
                  </td>

                  <td>{c.message}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
