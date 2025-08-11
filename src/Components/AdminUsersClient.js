"use client";

import { useEffect, useState } from "react";
import fetchUsers from "@/app/actions/fetchUsers";
import { manageUsers } from "@/app/actions/manageUsers";

export default function AdminUsersClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [status, setStatus] = useState("");

  const refreshUsers = async () => {
    const updated = await fetchUsers();
    setUsers(updated);
  };

  const handleVerify = async (id) => {
    const res = await manageUsers("verify", { id });
    if (res.success) {
      await refreshUsers();
    } else {
      setStatus("Error: " + res.error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await manageUsers("delete", { id });
    if (res.success) {
      await refreshUsers();
    } else {
      setStatus("Error: " + res.error);
    }
  };

  return (
    <main className="container py-5">
      <h2 className="text-center mb-4">Manage Users</h2>

      {status && <p className="text-danger">{status}</p>}

      <div className="table-responsive">
        <table className="table table-bordered align-middle table-striped">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isVerified ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>
                  <td>
                    {!user.isVerified && (
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleVerify(user.id)}
                      >
                        Verify
                      </button>
                    )}
                    {user.role !== "admin" && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
