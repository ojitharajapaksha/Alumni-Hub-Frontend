import apiClient from "../client"

export interface UserData {
  username: string
  email: string
  password?: string
  role: {
    id: number
    name: string
    type: string
  }
  assignedField?: string
  confirmed?: boolean
  blocked?: boolean
}

export interface UserResponse {
  id: number
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  role: {
    id: number
    name: string
    type: string
  }
  assignedField?: string
}

export const userService = {
  async getAll(): Promise<UserResponse[]> {
    const response = await apiClient.get("/user-management/all")
    return response.data
  },

  async getById(id: number): Promise<UserResponse> {
    const response = await apiClient.get(`/user-management/${id}`)
    return response.data
  },

  async create(data: {
    username: string
    email: string
    password: string
    role: number
    assignedField?: string
  }): Promise<UserResponse> {
    const response = await apiClient.post("/user-management/create", data)
    return response.data
  },

  async update(
    id: number,
    data: Partial<{
      username: string
      email: string
      password: string
      role: number
      assignedField: string
    }>
  ): Promise<UserResponse> {
    const response = await apiClient.put(`/user-management/update/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/user-management/delete/${id}`)
  },

  async getRoles(): Promise<{ id: number; name: string; type: string }[]> {
    const response = await apiClient.get("/user-management/roles")
    return response.data
  },
}
