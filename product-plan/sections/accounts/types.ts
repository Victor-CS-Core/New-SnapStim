/**
 * User roles in SnapStim
 */
export type UserRole = 'BCBA' | 'RBT' | 'Caregiver'

/**
 * User account status
 */
export type UserStatus = 'Active' | 'Inactive' | 'Pending'

/**
 * User account interface
 */
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  phone?: string
  createdAt: string
  lastActiveAt: string | null
  assignedClients: string[]
  assignedPrograms?: string[]
}

/**
 * User list filter options
 */
export interface UserFilters {
  role?: UserRole
  status?: UserStatus
  search?: string
}

/**
 * User form data for create/edit
 */
export interface UserFormData {
  name: string
  email: string
  role: UserRole
  phone?: string
  avatar?: string
  assignedClients: string[]
  assignedPrograms?: string[]
}

/**
 * Props for user list view
 */
export interface UserListProps {
  users: User[]
  filters?: UserFilters
  onFilterChange?: (filters: UserFilters) => void
  onUserClick?: (userId: string) => void
  onEditUser?: (userId: string) => void
  onDeactivateUser?: (userId: string) => void
}

/**
 * Props for user detail view
 */
export interface UserDetailProps {
  user: User
  onEdit?: () => void
  onDeactivate?: () => void
  onViewActivity?: () => void
}

/**
 * Props for user form
 */
export interface UserFormProps {
  user?: User
  onSubmit: (data: UserFormData) => void
  onCancel: () => void
}
