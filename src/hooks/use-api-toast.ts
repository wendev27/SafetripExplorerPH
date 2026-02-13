"use client";

import { useToast } from "@/components/ui/toast";

interface ApiCallOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function useApiToast() {
  const { addToast } = useToast();

  const apiCall = async <T>(
    apiFunction: () => Promise<T>,
    options: ApiCallOptions = {}
  ): Promise<T | null> => {
    try {
      const result = await apiFunction();
      
      if (options.successMessage) {
        addToast({
          message: options.successMessage,
          type: "success",
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess();
      }
      
      return result;
    } catch (error: any) {
      const message = options.errorMessage || 
        error?.message || 
        "An error occurred";
      
      addToast({
        message,
        type: "error",
      });
      
      if (options.onError) {
        options.onError();
      }
      
      return null;
    }
  };

  return { apiCall };
}
