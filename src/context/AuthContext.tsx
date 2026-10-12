import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ParentWard } from '../types';
import { mockUsers, mockParentProfile } from '../data/mockData';

interface AuthContextType {
  role: UserRole | null;
  user: User | null;
  selectedWard: ParentWard | null;
  wards: ParentWard[];
  setSelectedWardId: (studentId: string) => void;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('fea_auth_role') as UserRole;
    return saved || 'admin'; // Default to admin for immediate exploration
  });

  const [selectedWardId, setSelectedWardIdState] = useState<string>(() => {
    return mockParentProfile.wards[0]?.studentId || '';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (role) {
      localStorage.setItem('fea_auth_role', role);
    } else {
      localStorage.removeItem('fea_auth_role');
    }
  }, [role]);

  const user = role ? mockUsers[role] || null : null;
  const wards = mockParentProfile.wards;
  const selectedWard = wards.find((w) => w.studentId === selectedWardId) || wards[0] || null;

  const login = (newRole: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setRole(newRole);
      setIsLoading(false);
    }, 250);
  };

  const logout = () => {
    setRole(null);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const setSelectedWardId = (studentId: string) => {
    setSelectedWardIdState(studentId);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        selectedWard,
        wards,
        setSelectedWardId,
        login,
        logout,
        switchRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
