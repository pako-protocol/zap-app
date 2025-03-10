import { create } from 'zustand';

// Define the store's type
interface AccessStore {
  accessCode: string;
  isValid: boolean | null;
  setAccessCode: (code: string) => void;
  setIsValid: (isValid: boolean) => void;
}

// Create Zustand store with type safety
const useAccessStore = create<AccessStore>((set) => ({
  accessCode: '',
  isValid: null,
  setAccessCode: (code: string) => set({ accessCode: code, isValid: null }),
  setIsValid: (isValid: boolean) => set({ isValid }),
}));

export default useAccessStore;
