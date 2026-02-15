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

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Enhance error message with more context
      if (error instanceof Error) {
        // If it's a fetch/network error, provide better feedback
        if (error.message.includes('fetch')) {
          throw new Error(`Backend unreachable at ${this.baseUrl}. Is the server running?`);
        }
        throw error;
      }
      throw new Error('Unknown error occurred during API request');
    }
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
   * Save/create session
   * POST /api/session/save
   */
  async saveSession(sessionData: {
    userId: string;
    sessionId: string;
    clientId: string;
    programId: string;
    stimuli: any;
    images?: any;
    meta?: any;
  }) {
    return this.request('/api/session/save', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
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

  /**
   * List programs for a user (optionally filtered by clientId)
   * GET /api/program/list?userId=:userId&clientId=:clientId
   */
  async listPrograms(userId: string = 'device', clientId?: string) {
    const params = new URLSearchParams({ userId });
    if (clientId) {
      params.append('clientId', clientId);
    }
    return this.request(`/api/program/list?${params.toString()}`);
  }

  /**
   * Get single program by ID
   * GET /api/program/:userId/:clientId/:programId
   */
  async getProgram(userId: string, clientId: string, programId: string) {
    return this.request(`/api/program/${userId}/${clientId}/${programId}`);
  }

  /**
   * Save/create a new program
   * POST /api/program/save
   */
  async saveProgram(userId: string, program: any) {
    return this.request('/api/program/save', {
      method: 'POST',
      body: JSON.stringify({ userId, program }),
    });
  }

  /**
   * Update existing program
   * PUT /api/program/update
   */
  async updateProgram(userId: string, program: any) {
    return this.request('/api/program/update', {
      method: 'PUT',
      body: JSON.stringify({ userId, program }),
    });
  }

  /**
   * Delete a program
   * DELETE /api/program/delete
   */
  async deleteProgram(userId: string, programId: string, clientId: string) {
    return this.request('/api/program/delete', {
      method: 'DELETE',
      body: JSON.stringify({ userId, programId, clientId }),
    });
  }

  // ===================================
  // STIMULI/REVIEW
  // ===================================

  /**
   * Generate stimulus image using GetImg API
   * POST /api/stimuli
   */
  async generateStimulus(data: {
    programType: string;
    fields?: Record<string, any>;
  }) {
    // Map frontend program types to backend types
    const programTypeMap: Record<string, string> = {
      'expressive_labeling': 'tacting',
      'receptive_identification': 'lr',
      'listener_responding': 'lr',
      'intraverbal': 'intraverbal',
    };

    const backendProgramType = programTypeMap[data.programType] || 'tacting';

    return this.request('/api/stimuli', {
      method: 'POST',
      body: JSON.stringify({
        programType: backendProgramType,
        fields: data.fields || {},
      }),
    });
  }

  /**
   * List stimuli for a user (optionally filtered by programId and status)
   * GET /api/stimuli/list?userId=:userId&programId=:programId&status=:status
   */
  async listStimuli(userId: string = 'device', programId?: string, status?: string) {
    const params = new URLSearchParams({ userId });
    if (programId) {
      params.append('programId', programId);
    }
    if (status) {
      params.append('status', status);
    }
    return this.request(`/api/stimuli/list?${params.toString()}`);
  }

  /**
   * Get single stimulus by ID
   * GET /api/stimuli/:userId/:programId/:stimulusId
   */
  async getStimulus(userId: string, programId: string, stimulusId: string) {
    return this.request(`/api/stimuli/${userId}/${programId}/${stimulusId}`);
  }

  /**
   * Save generated stimulus to storage
   * POST /api/stimuli/save
   */
  async saveStimulus(userId: string, programId: string, stimulus: any) {
    return this.request('/api/stimuli/save', {
      method: 'POST',
      body: JSON.stringify({ userId, programId, stimulus }),
    });
  }

  /**
   * Delete a stimulus (soft delete)
   * DELETE /api/stimuli/delete
   */
  async deleteStimulus(userId: string, stimulusId: string, programId: string) {
    return this.request('/api/stimuli/delete', {
      method: 'DELETE',
      body: JSON.stringify({ userId, stimulusId, programId }),
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
