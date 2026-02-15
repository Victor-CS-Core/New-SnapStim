/**
 * API Client
 * 
 * Connects to the Express backend (mobile app server) at localhost:8787.
 * Provides methods for all existing backend API routes.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request method
   */
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  // ===================================
  // HEALTH CHECK
  // ===================================

  /**
   * Check backend health
   * GET /api/health
   */
  async health() {
    return this.request<{ ok: boolean }>('/api/health');
  }

  // ===================================
  // CLIENTS
  // ===================================

  /**
   * List all clients for a user
   * GET /api/client/list?userId=:userId
   */
  async listClients(userId: string = 'device') {
    return this.request<{
      ok: boolean;
      clients: any[];
      count: number;
    }>(`/api/client/list?userId=${userId}`);
  }

  /**
   * Save a client (create or update)
   * POST /api/client/save
   */
  async saveClient(userId: string, client: any) {
    return this.request('/api/client/save', {
      method: 'POST',
      body: JSON.stringify({ userId, client }),
    });
  }

  /**
   * Delete a client
   * DELETE /api/client/delete
   */
  async deleteClient(userId: string, clientId: string) {
    return this.request('/api/client/delete', {
      method: 'DELETE',
      body: JSON.stringify({ userId, clientId }),
    });
  }

  // ===================================
  // SESSIONS
  // ===================================

  /**
   * List all sessions for a user
   * GET /api/sessions?userId=:userId
   */
  async listSessions(userId: string = 'device') {
    return this.request(`/api/sessions?userId=${userId}`);
  }

  /**
   * Export session data
   * POST /api/session/export
   */
  async exportSession(sessionData: any) {
    return this.request('/api/session/export', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  // ===================================
  // PROGRAMS
  // ===================================

  /**
   * Generate program content using AI
   * POST /api/program/generate
   */
  async generateProgram(programData: any) {
    return this.request('/api/program/generate', {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  }

  // ===================================
  // STIMULI/REVIEW
  // ===================================

  /**
   * Generate stimulus image using GetImg API
   * POST /api/stimulus/generate
   */
  async generateStimulus(prompt: string, options?: any) {
    return this.request('/api/stimulus/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, ...options }),
    });
  }

  /**
   * Review/approve AI-generated stimuli
   * POST /api/review/submit
   */
  async submitReview(reviewData: any) {
    return this.request('/api/review/submit', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // ===================================
  // AI SERVICES (Direct access if needed)
  // ===================================

  /**
   * Get AI suggestions using Replicate (Llama 2)
   * POST /api/ai/suggest
   */
  async getAISuggestion(prompt: string, context?: any) {
    return this.request('/api/ai/suggest', {
      method: 'POST',
      body: JSON.stringify({ prompt, context }),
    });
  }
}

// Export singleton instance as default
const api = new ApiClient(API_BASE_URL);
export default api;

// Also export as named for flexibility
export { api };

// Export class for testing
export { ApiClient };
