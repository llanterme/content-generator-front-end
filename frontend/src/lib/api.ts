import axios from "axios";
import {
  Platform,
  Tone,
  GenerationRequest,
  GenerationResponse,
  HealthResponse,
  StatusResponse,
  LinkedInPostRequest,
  LinkedInPostResponse,
  LinkedInStatusResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// API functions
export const apiClient = {
  // Health and status
  getHealth: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>("/health");
    return response.data;
  },

  getStatus: async (): Promise<StatusResponse> => {
    const response = await api.get<StatusResponse>("/status");
    return response.data;
  },

  // Platform and tone discovery
  getPlatforms: async (): Promise<{ platforms: Platform[] }> => {
    const response = await api.get<{ platforms: Platform[] }>("/platforms");
    return response.data;
  },

  getTones: async (): Promise<{ tones: Tone[] }> => {
    const response = await api.get<{ tones: Tone[] }>("/tones");
    return response.data;
  },

  // Content generation
  generateContent: async (request: GenerationRequest): Promise<GenerationResponse> => {
    const response = await api.post<GenerationResponse>("/generate", request);
    return response.data;
  },

  // LinkedIn integration
  getLinkedInStatus: async (): Promise<LinkedInStatusResponse> => {
    const response = await api.get<LinkedInStatusResponse>("/linkedin/status");
    return response.data;
  },

  postToLinkedIn: async (request: LinkedInPostRequest): Promise<LinkedInPostResponse> => {
    const response = await api.post<LinkedInPostResponse>("/linkedin/post", request);
    return response.data;
  },
};

// WebSocket connection helper
export const createWebSocketConnection = (
  onMessage: (data: unknown) => void,
  onError: (error: Event) => void,
  onClose: (event: CloseEvent) => void
): WebSocket => {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
  const ws = new WebSocket(`${WS_URL}/ws/generate`);

  ws.onopen = () => {
    console.log("WebSocket connected");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  ws.onerror = onError;
  ws.onclose = onClose;

  return ws;
};

// React Query keys
export const queryKeys = {
  health: ["health"] as const,
  status: ["status"] as const,
  platforms: ["platforms"] as const,
  tones: ["tones"] as const,
  linkedInStatus: ["linkedin", "status"] as const,
} as const;