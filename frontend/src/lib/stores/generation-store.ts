import { create } from "zustand";
import { GenerationStore, GenerationState, GenerationRequest, GenerationResponse, ProgressUpdate } from "../types";
import { createWebSocketConnection } from "../api";

const initialState: GenerationState = {
  isGenerating: false,
  currentStep: null,
  progress: 0,
  error: null,
  result: null,
};

export const useGenerationStore = create<GenerationStore>((set, get) => ({
  generationState: initialState,
  websocket: null,
  pendingRequest: null,

  startGeneration: (request: GenerationRequest) => {
    set({
      generationState: {
        ...initialState,
        isGenerating: true,
        currentStep: "Connecting to server...",
        progress: 5,
      },
    });

    // Always create a fresh WebSocket connection for each generation
    const { connectWebSocket } = get();
    connectWebSocket();

    // Store the request to send once WebSocket confirms connection
    set({ pendingRequest: request });
  },

  updateProgress: (update: ProgressUpdate) => {
    const currentState = get().generationState;
    
    let progress = currentState.progress;
    const currentStep = update.message;

    switch (update.status) {
      case "connected":
        // WebSocket connected, send the pending request
        const { websocket, pendingRequest } = get();
        if (websocket && pendingRequest) {
          websocket.send(JSON.stringify(pendingRequest));
          set({ pendingRequest: null }); // Clear pending request
          progress = 10;
        }
        break;
      case "started":
        progress = 20;
        break;
      case "research":
        progress = 40;
        break;
      case "content":
        progress = 70;
        break;
      case "image":
        progress = 90;
        break;
      case "completed":
        progress = 100;
        break;
      case "error":
        progress = 0;
        break;
    }

    set({
      generationState: {
        ...currentState,
        currentStep,
        progress,
        error: update.status === "error" ? update.error || update.message : null,
      },
    });
  },

  completeGeneration: (result: GenerationResponse) => {
    set({
      generationState: {
        isGenerating: false,
        currentStep: "Generation completed!",
        progress: 100,
        error: result.success ? null : result.error || "Unknown error occurred",
        result,
      },
    });
  },

  setError: (error: string) => {
    set({
      generationState: {
        ...get().generationState,
        isGenerating: false,
        error,
        progress: 0,
      },
    });
  },

  reset: () => {
    set({
      generationState: initialState,
      pendingRequest: null,
    });
  },

  connectWebSocket: () => {
    // Close existing connection if any
    const currentWs = get().websocket;
    if (currentWs) {
      currentWs.close();
    }

    const ws = createWebSocketConnection(
      (data) => {
        const { updateProgress, completeGeneration } = get();
        
        // Type guard to ensure data has the expected structure
        if (data && typeof data === "object" && "status" in data) {
          const progressData = data as ProgressUpdate & { data?: unknown };
          
          if (progressData.status === "completed" && progressData.data) {
            try {
              const result = typeof progressData.data === "string" ? JSON.parse(progressData.data) : progressData.data;
              completeGeneration(result as GenerationResponse);
            } catch (error) {
              console.error("Failed to parse completion data:", error);
              updateProgress({
                status: "error",
                message: "Failed to parse response data",
                error: "Parse error",
              });
            }
          } else {
            updateProgress(progressData);
          }
        }
      },
      (error) => {
        console.error("WebSocket error:", error);
        get().setError("Unable to connect to backend server. Please ensure the API server is running on http://localhost:8000");
      },
      (event) => {
        console.log("WebSocket closed:", event);
        set({ websocket: null });
        
        // If it was an unexpected close, show error
        if (event.code !== 1000) {
          get().setError("Connection to server lost. Please check that the backend server is running and try again.");
        }
      }
    );

    set({ websocket: ws });
  },

  disconnectWebSocket: () => {
    const { websocket } = get();
    if (websocket) {
      websocket.close();
      set({ websocket: null, pendingRequest: null });
    }
  },
}));