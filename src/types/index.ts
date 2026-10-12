export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  title?: string;
  associatedId?: string; // Links to teacherId, studentId, or parentId
}

export interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dob: string;
  classId: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  bloodGroup: string;
  stateOfOrigin: string;
  lga: string;
  avatar: string;
  status: 'Active' | 'Suspended' | 'Transferred';
  feeBalance: number;
  attendancePercentage: number;
  parentId: string;
  enrolledDate: string;
}

export interface Teacher {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  qualification: string;
  department: 'Sciences' | 'Arts & Humanities' | 'Commercial' | 'Languages' | 'Vocational';
  subjects: string[];
  assignedClasses: string[];
  isClassTeacherOf?: string;
  avatar: string;
  status: 'Active' | 'On Leave';
  dateJoined: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g., "JSS 1A", "SS 3 Science"
  level: 'Junior' | 'Senior';
  classTeacherId: string;
  classTeacherName: string;
  studentCount: number;
  capacity: number;
  room: string;
  subjects: string[];
}

export interface AttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  remark?: string;
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  subject: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  session: string;
  ca1: number; // 20 max
  ca2: number; // 20 max
  exam: number; // 60 max
  total: number; // 100 max
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  remark: string;
}

export interface FeeStructure {
  id: string;
  title: string;
  classCategory: 'Junior Secondary' | 'Senior Secondary' | 'All';
  tuitionFee: number;
  developmentLevy: number;
  ictFee: number;
  ptaLevy: number;
  laboratoryFee?: number;
  totalAmount: number;
  term: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  amountPaid: number;
  totalDue: number;
  balance: number;
  paymentDate: string;
  paymentMethod: 'Bank Transfer' | 'POS' | 'Cash' | 'Card Online';
  status: 'Paid' | 'Partial' | 'Pending';
  term: string;
  session: string;
  recordedBy: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  period: number;
  subject: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'All' | 'Teachers' | 'Students' | 'Parents';
  author: string;
  authorRole: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  pinned?: boolean;
}

export interface SchoolSettings {
  schoolName: string;
  motto: string;
  established: string;
  address: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  currentSession: string;
  currentTerm: '1st Term' | '2nd Term' | '3rd Term';
  principalName: string;
  nextTermResumption: string;
}

export interface ParentWard {
  studentId: string;
  name: string;
  admissionNo: string;
  className: string;
  avatar: string;
  attendancePercentage: number;
  averageGrade: number;
  feeBalance: number;
}

export interface ParentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  address: string;
  wards: ParentWard[];
}
