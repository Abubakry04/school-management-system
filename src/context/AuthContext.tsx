import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, UserRole, ParentWard } from '../types';
import { mockUsers } from '../data/mockData';
import { useSchoolStore } from '../store/useSchoolStore';

export interface LoginCredentials {
  email: string;
  password?: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  role: UserRole | null;
  user: User | null;
  selectedWard: ParentWard | null;
  wards: ParentWard[];
  setSelectedWardId: (studentId: string) => void;
  login: (role: UserRole) => Promise<AuthResponse>;
  loginWithCredentials: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('fea_auth_role') as UserRole;
    return saved && ['admin', 'teacher', 'student', 'parent'].includes(saved) ? saved : null;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedRole = localStorage.getItem('fea_auth_role') as UserRole;
    return savedRole ? mockUsers[savedRole] || null : null;
  });

  const [selectedWardId, setSelectedWardIdState] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const students = useSchoolStore((state) => state.students);
  const grades = useSchoolStore((state) => state.grades);

  useEffect(() => {
    if (role) {
      localStorage.setItem('fea_auth_role', role);
      if (!currentUser && mockUsers[role]) {
        setCurrentUser(mockUsers[role]);
      }
    } else {
      localStorage.removeItem('fea_auth_role');
      setCurrentUser(null);
    }
  }, [role, currentUser]);

  // Dynamically resolve wards linked to the active parent account
  const wards: ParentWard[] = useMemo(() => {
    if (!currentUser || currentUser.role !== 'parent') return [];

    let matched = students.filter(
      (s) =>
        (s.guardianEmail && currentUser.email && s.guardianEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
        s.parentId === currentUser.id
    );

    // If demo parent has no exact email matches, link all active students in the registry
    if (
      matched.length === 0 &&
      (currentUser.email === 'parent@federalexcellence.edu.ng' || currentUser.id === 'usr-par-01')
    ) {
      matched = students.filter((s) => s.status === 'Active');
    }

    return matched.map((s) => {
      const studentGrades = grades.filter((g) => g.studentId === s.id);
      const avg =
        studentGrades.length > 0
          ? Math.round(studentGrades.reduce((sum, g) => sum + g.total, 0) / studentGrades.length)
          : 85;

      return {
        studentId: s.id,
        name: s.fullName,
        admissionNo: s.admissionNo,
        className: s.className,
        avatar: s.avatar,
        attendancePercentage: s.attendancePercentage || 100,
        averageGrade: avg,
        feeBalance: s.feeBalance || 0,
      };
    });
  }, [students, grades, currentUser]);

  const selectedWard = wards.find((w) => w.studentId === selectedWardId) || wards[0] || null;

  // Sign in using credentials
  const loginWithCredentials = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 250));

    try {
      const targetUser = mockUsers[credentials.role];
      if (!targetUser) {
        return {
          success: false,
          error: `No mock profile configured for role "${credentials.role}".`,
        };
      }

      setRole(credentials.role);
      setCurrentUser(targetUser);
      localStorage.setItem('fea_auth_role', credentials.role);

      return {
        success: true,
        user: targetUser,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // One-click demo role login
  const login = async (newRole: UserRole): Promise<AuthResponse> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 200));

    const targetUser = mockUsers[newRole];
    if (targetUser) {
      setRole(newRole);
      setCurrentUser(targetUser);
      localStorage.setItem('fea_auth_role', newRole);
      setIsLoading(false);
      return {
        success: true,
        user: targetUser,
      };
    }

    setIsLoading(false);
    return {
      success: false,
      error: `Could not find account for role ${newRole}`,
    };
  };

  const logout = () => {
    setRole(null);
    setCurrentUser(null);
    localStorage.removeItem('fea_auth_role');
  };

  const switchRole = (newRole: UserRole) => {
    if (mockUsers[newRole]) {
      setCurrentUser(mockUsers[newRole]);
    }
    setRole(newRole);
    localStorage.setItem('fea_auth_role', newRole);
  };

  const setSelectedWardId = (studentId: string) => {
    setSelectedWardIdState(studentId);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user: currentUser,
        selectedWard,
        wards,
        setSelectedWardId,
        login,
        loginWithCredentials,
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
