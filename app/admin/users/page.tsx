"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { usersAPI } from "@/lib/admin/api";

interface User {
  id: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  permissions: string[];
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const allTasks = [
  { id: "task1", name: "मूलभूत माहिती" },
  { id: "task2", name: "दस्तऐवज" },
  { id: "task3", name: "प्रमाणपत्रे" },
  { id: "task4", name: "ईमेल पडताळणी" },
  { id: "task5", name: "पायाभूत सुविधा" },
  { id: "task6", name: "ऐतिहासिक माहिती" },
  { id: "task7", name: "ग्रामपंचायत माहिती" },
  { id: "task8", name: "घोषणा" },
  { id: "task9", name: "हिरो इमेज" },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "editor" as "admin" | "editor" | "viewer",
    permissions: [] as string[],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!formData.email || !formData.password) {
        alert("कृपया ईमेल आणि पासवर्ड भरा");
        return;
      }

      const permissions =
        formData.role === "admin" ? ["*"] : formData.permissions;

      const response = await usersAPI.create({
        ...formData,
        permissions,
      });

      if (response.success) {
        alert("वापरकर्ता यशस्वीरित्या तयार केला");
        setShowCreateForm(false);
        setFormData({
          email: "",
          password: "",
          role: "editor",
          permissions: [],
        });
        fetchUsers();
      } else {
        alert(response.message || "Error creating user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("वापरकर्ता तयार करताना त्रुटी");
    }
  };

  const handleUpdateUser = async (userId: string) => {
    try {
      if (!editingUser) return;

      const permissions =
        editingUser.role === "admin" ? ["*"] : editingUser.permissions;

      const response = await usersAPI.update(userId, {
        email: editingUser.email,
        role: editingUser.role,
        permissions,
        is_active: editingUser.is_active,
      });

      if (response.success) {
        alert("वापरकर्ता अद्यतनित केला");
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(response.message || "Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("वापरकर्ता अद्यतनित करताना त्रुटी");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("तुम्हाला खात्री आहे की तुम्ही हा वापरकर्ता हटवू इच्छिता?")) {
      return;
    }

    try {
      const response = await usersAPI.delete(userId);
      if (response.success) {
        alert("वापरकर्ता हटवला");
        fetchUsers();
      } else {
        alert(response.message || "Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("वापरकर्ता हटवताना त्रुटी");
    }
  };

  const togglePermission = (taskId: string, user: User) => {
    if (!editingUser || editingUser.id !== user.id) return;

    const newPermissions = editingUser.permissions.includes(taskId)
      ? editingUser.permissions.filter((p) => p !== taskId)
      : [...editingUser.permissions, taskId];

    setEditingUser({ ...editingUser, permissions: newPermissions });
  };

  const toggleFormPermission = (taskId: string) => {
    const newPermissions = formData.permissions.includes(taskId)
      ? formData.permissions.filter((p) => p !== taskId)
      : [...formData.permissions, taskId];

    setFormData({ ...formData, permissions: newPermissions });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-center">लोड करत आहे...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              वापरकर्ता व्यवस्थापन
            </h1>
            <p className="text-gray-600 mt-2">
              वापरकर्ते आणि त्यांच्या परवानग्या व्यवस्थापित करा
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "रद्द करा" : "+ नवीन वापरकर्ता"}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>नवीन वापरकर्ता तयार करा</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ईमेल</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    पासवर्ड
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="********"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    भूमिका
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "editor" | "viewer") =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        Admin (सर्व परवानग्या)
                      </SelectItem>
                      <SelectItem value="editor">
                        Editor (निवडक कार्ये)
                      </SelectItem>
                      <SelectItem value="viewer">Viewer (केवळ पहा)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === "editor" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      परवानग्या
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {allTasks.map((task) => (
                        <label
                          key={task.id}
                          className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(task.id)}
                            onChange={() => toggleFormPermission(task.id)}
                            className="rounded"
                          />
                          <span className="text-sm">{task.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={handleCreateUser} className="w-full">
                  वापरकर्ता तयार करा
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                {editingUser?.id === user.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ईमेल
                      </label>
                      <Input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        भूमिका
                      </label>
                      <Select
                        value={editingUser.role}
                        onValueChange={(value: "admin" | "editor" | "viewer") =>
                          setEditingUser({ ...editingUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {editingUser.role === "editor" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          परवानग्या
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {allTasks.map((task) => (
                            <label
                              key={task.id}
                              className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={editingUser.permissions.includes(
                                  task.id
                                )}
                                onChange={() => togglePermission(task.id, user)}
                                className="rounded"
                              />
                              <span className="text-sm">{task.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingUser.is_active}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            is_active: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <label className="text-sm font-medium">सक्रिय</label>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateUser(user.id)}>
                        सेव्ह करा
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingUser(null)}
                      >
                        रद्द करा
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{user.email}</h3>
                        <div className="flex gap-2 mt-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "editor"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              user.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.is_active ? "सक्रिय" : "निष्क्रिय"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(user)}
                        >
                          संपादित करा
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          हटवा
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>
                        परवानग्या:{" "}
                        {user.permissions.includes("*")
                          ? "सर्व कार्ये"
                          : user.permissions.length === 0
                          ? "केवळ पहा"
                          : user.permissions
                              .map(
                                (p) => allTasks.find((t) => t.id === p)?.name
                              )
                              .join(", ")}
                      </p>
                      {user.last_login && (
                        <p className="mt-1">
                          शेवटचे लॉगिन:{" "}
                          {new Date(user.last_login).toLocaleString("mr-IN")}
                        </p>
                      )}
                      <p className="mt-1">
                        तयार केले:{" "}
                        {new Date(user.created_at).toLocaleString("mr-IN")}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
