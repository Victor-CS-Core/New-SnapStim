import { useState, useMemo } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserList from "./components/UserList";
import UserFilters from "./components/UserFilters";
import UserDetail from "./components/UserDetail";
import accountsData from "../../../product-plan/sections/accounts/data.json";
import type {
  User,
  UserFilters as UserFiltersType,
} from "../../../product-plan/sections/accounts/types";

const users = accountsData.users as User[];

export default function AccountsView() {
  const [filters, setFilters] = useState<UserFiltersType>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filter by role
      if (filters.role && user.role !== filters.role) {
        return false;
      }
      // Filter by status
      if (filters.status && user.status !== filters.status) {
        return false;
      }
      // Filter by search
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(search);
        const matchesEmail = user.email.toLowerCase().includes(search);
        if (!matchesName && !matchesEmail) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return users.find((u) => u.id === selectedUserId) || null;
  }, [selectedUserId]);

  const stats = useMemo(
    () => ({
      total: users.length,
      bcba: users.filter((u) => u.role === "BCBA").length,
      rbt: users.filter((u) => u.role === "RBT").length,
      caregiver: users.filter((u) => u.role === "Caregiver").length,
      active: users.filter((u) => u.status === "Active").length,
      pending: users.filter((u) => u.status === "Pending").length,
    }),
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Accounts
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Manage users and their permissions
          </p>
        </div>
        <Button
          onClick={() => {
            // TODO: Implement user creation
            // Recommended: Show a modal form with fields for:
            // - Name, email, role (BCBA/RBT/Caregiver)
            // - Permissions and access levels
            // - Send invitation email
            console.log("Add User clicked - implement creation flow");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>BCBAs</CardDescription>
            <CardTitle className="text-3xl text-purple-600 dark:text-purple-400">
              {stats.bcba}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>RBTs</CardDescription>
            <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">
              {stats.rbt}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Caregivers</CardDescription>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">
              {stats.caregiver}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* User List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>User Directory</CardTitle>
            </div>
            <div className="text-sm text-stone-500 dark:text-stone-400">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserFilters filters={filters} onFilterChange={setFilters} />
          <UserList
            users={filteredUsers}
            onUserClick={(id) => setSelectedUserId(id)}
            onEditUser={(id) => {
              // TODO: Implement user editing
              // Options:
              // 1. Show inline edit in UserDetail modal
              // 2. Show separate edit form modal
              // Editable fields: name, email, role, permissions, status
              console.log("Edit user:", id);
            }}
            onDeactivateUser={(id) => {
              // TODO: Implement user deactivation
              // Steps:
              // 1. Show confirmation dialog
              // 2. Call API to deactivate user
              // 3. Update local state to reflect status change
              // 4. Consider reassigning their clients/programs
              console.log("Deactivate user:", id);
            }}
          />
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetail
          user={selectedUser}
          onClose={() => setSelectedUserId(null)}
          onEdit={() => {
            // TODO: Switch to edit mode or show edit form
            // Could reuse the same UserDetail component in edit mode
            console.log("Edit user:", selectedUser.id);
          }}
        />
      )}
    </div>
  );
}
