// API Request/Response Types
export interface Platform {
  name: string;
  display_name: string;
  max_length: number | null;
  description: string;
}

export interface Tone {
  name: string;
  display_name: string;
  description: string;
}

export interface GenerationRequest {
  topic: string;
  platform: string;
  tone: string;
}

export interface GenerationResponse {
  success: boolean;
  topic: string;
  platform: string;
  tone: string;
  research_bullet_points: string[];
  generated_content: string;
  word_count: number;
  generated_image_path: string | null;
  execution_time_seconds: number;
  error?: string;
  metadata: Record<string, unknown>;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

export interface StatusResponse {
  service: string;
  workflow_status: Record<string, unknown>;
  dependencies: Record<string, string>;
  health: string;
}

// WebSocket Message Types
export interface ProgressUpdate {
  status: "connected" | "started" | "research" | "content" | "image" | "completed" | "error";
  message: string;
  data?: unknown;
  error?: string;
}

// UI State Types
export interface GenerationState {
  isGenerating: boolean;
  currentStep: string | null;
  progress: number;
  error: string | null;
  result: GenerationResponse | null;
}

export interface FormData {
  topic: string;
  platform: string;
  tone: string;
}

// History Types
export interface HistoryItem {
  id: string;
  timestamp: string;
  request: GenerationRequest;
  response: GenerationResponse;
}

// Store Types
export interface GenerationStore {
  // State
  generationState: GenerationState;
  websocket: WebSocket | null;
  pendingRequest: GenerationRequest | null;
  
  // Actions
  startGeneration: (request: GenerationRequest) => void;
  updateProgress: (update: ProgressUpdate) => void;
  completeGeneration: (result: GenerationResponse) => void;
  setError: (error: string) => void;
  reset: () => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

export interface HistoryStore {
  // State
  history: HistoryItem[];
  
  // Actions
  addHistoryItem: (item: HistoryItem) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
  loadHistory: () => void;
  saveHistory: () => void;
}

// LinkedIn Types
export interface LinkedInPostRequest {
  content: string;
  image_path?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN_MEMBERS';
}

export interface LinkedInPostResponse {
  success: boolean;
  linkedin_post_id?: string;
  linkedin_url?: string;
  error?: string;
  execution_time_seconds: number;
}

export interface LinkedInStatusResponse {
  configured: boolean;
  error?: string;
  capabilities?: {
    text_posting: boolean;
    image_posting: boolean;
    video_posting: boolean;
  };
}

export interface LinkedInState {
  isConfigured: boolean;
  isPosting: boolean;
  postingError: string | null;
  lastPostUrl: string | null;
}

export interface LinkedInStore {
  // State
  linkedInState: LinkedInState;
  
  // Actions
  checkLinkedInStatus: () => Promise<void>;
  postToLinkedIn: (request: LinkedInPostRequest) => Promise<LinkedInPostResponse>;
  resetPostingState: () => void;
  setPostingError: (error: string | null) => void;
}