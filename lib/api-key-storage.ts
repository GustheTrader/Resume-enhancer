
// Lightweight API key storage using localStorage
// This is a fallback option for users who don't want to log in

export interface StoredApiKey {
  id: string;
  provider: string;
  keyName: string;
  apiKey: string; // In localStorage, we store it as-is (client-side only)
  isActive: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'ground_up_careers_api_keys';

export const localApiKeyStorage = {
  // Get all API keys from localStorage
  getAll: (): StoredApiKey[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Get API key by provider
  getByProvider: (provider: string): StoredApiKey | undefined => {
    const keys = localApiKeyStorage.getAll();
    return keys.find(k => k.provider === provider && k.isActive);
  },

  // Save a new API key
  save: (provider: string, keyName: string, apiKey: string): StoredApiKey => {
    const keys = localApiKeyStorage.getAll();
    
    // Check if provider already exists
    const existingIndex = keys.findIndex(k => k.provider === provider);
    
    const newKey: StoredApiKey = {
      id: Date.now().toString(),
      provider,
      keyName,
      apiKey,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing
      keys[existingIndex] = newKey;
    } else {
      // Add new
      keys.push(newKey);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    return newKey;
  },

  // Delete an API key
  delete: (id: string): boolean => {
    const keys = localApiKeyStorage.getAll();
    const filtered = keys.filter(k => k.id !== id);
    
    if (filtered.length !== keys.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  // Clear all API keys
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
