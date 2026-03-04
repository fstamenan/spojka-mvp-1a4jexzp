import { create } from 'zustand';
import { User } from '@shared/types';
import { MOCK_USERS, MOCK_CLASSES } from '@shared/mock-data';
interface AuthState {
  user: User | null;
  users: User[]; // Local "database" of users
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (userData: { name: string; email: string; joinCode: string; mascotName: string; avatarSeed: string }) => Promise<void>;
  logout: () => void;
  updateXP: (amount: number) => void;
  updateMascotName: (newName: string) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  users: MOCK_USERS,
  isAuthenticated: false,
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    set((state) => {
      const foundUser = state.users.find(u => u.email === email);
      if (foundUser) {
        // In a real app we'd check password, here we just allow it for demo
        return { user: foundUser, isAuthenticated: true, isLoading: false };
      }
      throw new Error("Korisnik nije pronađen. Molimo vas proverite email.");
    });
  },
  signup: async ({ name, email, joinCode, mascotName, avatarSeed }) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const targetClass = MOCK_CLASSES.find(c => c.joinCode.toUpperCase() === joinCode.toUpperCase());
    if (!targetClass) {
      set({ isLoading: false });
      throw new Error("Nevažeći kod odeljenja. Molimo vas kontaktirajte profesora.");
    }
    set((state) => {
      if (state.users.some(u => u.email === email)) {
        throw new Error("Email je već u upotrebi.");
      }
      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        name,
        email,
        password: 'password123',
        role: 'student',
        classId: targetClass.id,
        mascotName,
        mascotStage: 'Egg',
        xpTotal: 0,
        xpCurrentLevel: 0,
        avatarSeed: avatarSeed,
      };
      return {
        users: [...state.users, newUser],
        user: newUser,
        isAuthenticated: true,
        isLoading: false
      };
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  updateXP: (amount) => set((state) => {
    if (!state.user) return state;
    const newTotal = state.user.xpTotal + amount;
    const newCurrent = state.user.xpCurrentLevel + amount;
    // Simple stage logic
    let stage: User['mascotStage'] = state.user.mascotStage;
    if (newTotal > 500) stage = 'Big Cat';
    else if (newTotal > 100) stage = 'Little Cat';
    const updatedUser = {
      ...state.user,
      xpTotal: newTotal,
      xpCurrentLevel: newCurrent,
      mascotStage: stage
    };
    return {
      user: updatedUser,
      users: state.users.map(u => u.id === state.user?.id ? updatedUser : u)
    };
  }),
  updateMascotName: (newName) => set((state) => {
    if (!state.user) return state;
    const updatedUser = {
      ...state.user,
      mascotName: newName
    };
    return {
      user: updatedUser,
      users: state.users.map(u => u.id === state.user?.id ? updatedUser : u)
    };
  })
}));