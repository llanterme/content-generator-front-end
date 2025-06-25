"use client";

import { create } from "zustand";
import { apiClient } from "@/lib/api";
import { LinkedInStore, LinkedInState, LinkedInPostRequest, LinkedInPostResponse } from "@/lib/types";

const initialLinkedInState: LinkedInState = {
  isConfigured: false,
  isPosting: false,
  postingError: null,
  lastPostUrl: null,
};

export const useLinkedInStore = create<LinkedInStore>((set) => ({
  linkedInState: initialLinkedInState,

  checkLinkedInStatus: async () => {
    try {
      const response = await apiClient.getLinkedInStatus();
      set((state) => ({
        linkedInState: {
          ...state.linkedInState,
          isConfigured: response.configured,
          postingError: response.error || null,
        },
      }));
    } catch (error) {
      console.error("Failed to check LinkedIn status:", error);
      set((state) => ({
        linkedInState: {
          ...state.linkedInState,
          isConfigured: false,
          postingError: "Failed to check LinkedIn configuration",
        },
      }));
    }
  },

  postToLinkedIn: async (request: LinkedInPostRequest): Promise<LinkedInPostResponse> => {
    set((state) => ({
      linkedInState: {
        ...state.linkedInState,
        isPosting: true,
        postingError: null,
      },
    }));

    try {
      const response = await apiClient.postToLinkedIn(request);
      
      set((state) => ({
        linkedInState: {
          ...state.linkedInState,
          isPosting: false,
          postingError: response.success ? null : (response.error || "Failed to post to LinkedIn"),
          lastPostUrl: response.linkedin_url || null,
        },
      }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to post to LinkedIn";
      
      set((state) => ({
        linkedInState: {
          ...state.linkedInState,
          isPosting: false,
          postingError: errorMessage,
        },
      }));

      return {
        success: false,
        error: errorMessage,
        execution_time_seconds: 0,
      };
    }
  },

  resetPostingState: () => {
    set((state) => ({
      linkedInState: {
        ...state.linkedInState,
        isPosting: false,
        postingError: null,
        lastPostUrl: null,
      },
    }));
  },

  setPostingError: (error: string | null) => {
    set((state) => ({
      linkedInState: {
        ...state.linkedInState,
        postingError: error,
      },
    }));
  },
}));