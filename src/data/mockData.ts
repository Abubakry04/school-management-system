import {
  User,
  Student,
  Teacher,
  SchoolClass,
  AttendanceEntry,
  GradeItem,
  FeeStructure,
  PaymentRecord,
  TimetableSlot,
  Announcement,
  SchoolSettings,
  ParentProfile,
  Subject,
  AdmissionApplicant
} from '../types';

// Company / Institutional Profile (Preserved as requested)
export const mockSchoolSettings: SchoolSettings = {
  schoolName: 'Federal Excellence Academy',
  motto: 'Excellence, Integrity & Leadership',
  established: '1998',
  address: 'Plot 14, Ahmadu Bello Way, Victoria Island, Lagos State, Nigeria',
  state: 'Lagos',
  phone: '+234 (0) 803 456 7890',
  email: 'info@federalexcellence.edu.ng',
  website: 'https://federalexcellence.edu.ng',
  currentSession: '2025/2026',
  currentTerm: '2nd Term',
  principalName: 'Dr. (Mrs.) Funmilayo Adeleke, Ph.D, FSTD',
  nextTermResumption: '28th April, 2026',
};

// Portal Demo Authentication Accounts
export const mockUsers: Record<string, User> = {
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. (Mrs.) Funmilayo Adeleke',
    email: 'admin@federalexcellence.edu.ng',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+234 802 334 5511',
    title: 'School Administrator / Principal',
  },
  teacher: {
    id: 'usr-tch-01',
    name: 'Academic Staff',
    email: 'staff@federalexcellence.edu.ng',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+234 803 778 9922',
    title: 'Faculty Staff Member',
  },
  student: {
    id: 'usr-stu-01',
    name: 'Student Portal User',
    email: 'student@federalexcellence.edu.ng',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    phone: '+234 812 445 6677',
    title: 'Enrolled Student',
  },
  parent: {
    id: 'usr-par-01',
    name: 'Parent / Guardian',
    email: 'parent@federalexcellence.edu.ng',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+234 802 998 8776',
    title: 'Parent Portal User',
  },
};

// Standard Accredited Curriculum Subjects
export const mockSubjects: Subject[] = [
  { id: 'sub-01', code: 'MTH-101', name: 'General Mathematics', department: 'Sciences', level: 'All', periodsPerWeek: 5, passMark: 50, headTeacherName: 'Mathematics Faculty' },
  { id: 'sub-02', code: 'ENG-101', name: 'English Language', department: 'Languages', level: 'All', periodsPerWeek: 5, passMark: 50, headTeacherName: 'Languages Faculty' },
  { id: 'sub-03', code: 'PHY-201', name: 'Physics', department: 'Sciences', level: 'Senior', periodsPerWeek: 4, passMark: 50, headTeacherName: 'Physics Faculty' },
  { id: 'sub-04', code: 'CHM-201', name: 'Chemistry', department: 'Sciences', level: 'Senior', periodsPerWeek: 4, passMark: 50, headTeacherName: 'Chemistry Faculty' },
  { id: 'sub-05', code: 'BIO-201', name: 'Biology', department: 'Sciences', level: 'Senior', periodsPerWeek: 4, passMark: 50, headTeacherName: 'Biology Faculty' },
  { id: 'sub-06', code: 'ECN-201', name: 'Economics', department: 'Commercial', level: 'Senior', periodsPerWeek: 4, passMark: 50, headTeacherName: 'Economics Faculty' },
  { id: 'sub-07', code: 'LIT-201', name: 'Literature in English', department: 'Languages', level: 'Senior', periodsPerWeek: 3, passMark: 50, headTeacherName: 'Literature Faculty' },
  { id: 'sub-08', code: 'BST-101', name: 'Basic Science & Technology', department: 'Sciences', level: 'Junior', periodsPerWeek: 4, passMark: 50, headTeacherName: 'Junior Science Faculty' },
];

// Baseline Classroom Structures (0 students assigned)
export const mockClasses: SchoolClass[] = [
  { id: 'cls-01', name: 'JSS 1A', level: 'Junior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Room 101', subjects: ['General Mathematics', 'English Language', 'Basic Science & Technology'] },
  { id: 'cls-02', name: 'JSS 2A', level: 'Junior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Room 102', subjects: ['General Mathematics', 'English Language', 'Basic Science & Technology'] },
  { id: 'cls-03', name: 'JSS 3A', level: 'Junior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Room 103', subjects: ['General Mathematics', 'English Language', 'Basic Science & Technology'] },
  { id: 'cls-04', name: 'SS 1 Science', level: 'Senior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Science Lab 1', subjects: ['Physics', 'Chemistry', 'Biology', 'General Mathematics', 'English Language'] },
  { id: 'cls-05', name: 'SS 2 Science', level: 'Senior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Science Lab 2', subjects: ['Physics', 'Chemistry', 'Biology', 'General Mathematics', 'English Language'] },
  { id: 'cls-06', name: 'SS 3 Science', level: 'Senior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Science Lab 3', subjects: ['Physics', 'Chemistry', 'Biology', 'General Mathematics', 'English Language'] },
];

// Official School Fee Schedule Benchmarks
export const mockFeeStructures: FeeStructure[] = [
  {
    id: 'fee-01',
    title: 'Senior Secondary Termly Clearance',
    classCategory: 'Senior Secondary',
    tuitionFee: 210000,
    developmentLevy: 35000,
    ictFee: 25000,
    ptaLevy: 10000,
    laboratoryFee: 10000,
    totalAmount: 290000,
    term: '2nd Term',
  },
  {
    id: 'fee-02',
    title: 'Junior Secondary Termly Clearance',
    classCategory: 'Junior Secondary',
    tuitionFee: 180000,
    developmentLevy: 30000,
    ictFee: 20000,
    ptaLevy: 10000,
    laboratoryFee: 0,
    totalAmount: 240000,
    term: '2nd Term',
  },
];

export const mockParentProfile: ParentProfile = {
  id: 'par-01',
  name: 'Parent / Guardian',
  email: 'parent@federalexcellence.edu.ng',
  phone: '+234 802 998 8776',
  occupation: 'Professional',
  address: 'Victoria Island, Lagos',
  wards: [],
};

// CLEAN SLATE: Hardcoded customers, invoices, grades, attendance removed
export const mockTeachers: Teacher[] = [];
export const mockStudents: Student[] = [];
export const mockPaymentRecords: PaymentRecord[] = [];
export const mockAttendanceRecords: AttendanceEntry[] = [];
export const mockGrades: GradeItem[] = [];
export const mockTimetableSlots: TimetableSlot[] = [];
export const mockAnnouncements: Announcement[] = [];
export const mockApplicants: AdmissionApplicant[] = [];

export const mockDashboardStats = {
  admin: {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 6,
    totalFeesCollected: 0,
    outstandingFees: 0,
    attendanceRate: 0,
  },
  teacher: {
    assignedStudents: 0,
    activeClasses: 0,
    todayPeriods: 0,
    pendingGradeEntries: 0,
  },
  student: {
    currentTermGPA: '0.00 / 5.00',
    overallPercentage: '0.0%',
    attendancePercentage: 0,
    feeStatus: 'No active dues',
    classRank: 'N/A',
  },
};

export const attendanceTrendData: { day: string; attendance: number; boys: number; girls: number }[] = [];
export const termFeeCollectionData: { month: string; collected: number; target: number }[] = [];
