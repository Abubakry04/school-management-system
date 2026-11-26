import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
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
  Subject,
  AdmissionApplicant,
  Assignment,
  AssignmentSubmission,
  AuditLog,
  BehavioralRating,
} from '../types';
import {
  mockSchoolSettings,
  mockFeeStructures,
  mockSubjects,
} from '../data/mockData';

// Standard empty classroom structures without hardcoded students
const initialClasses: SchoolClass[] = [
  { id: 'cls-01', name: 'JSS 1A', level: 'Junior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Room 101', subjects: ['Mathematics', 'English Language', 'Basic Science'] },
  { id: 'cls-02', name: 'JSS 2A', level: 'Junior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Room 102', subjects: ['Mathematics', 'English Language', 'Basic Science'] },
  { id: 'cls-03', name: 'JSS 3A', level: 'Junior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Room 103', subjects: ['Mathematics', 'English Language', 'Basic Science'] },
  { id: 'cls-04', name: 'SS 1 Science', level: 'Senior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Lab 1', subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'] },
  { id: 'cls-05', name: 'SS 2 Science', level: 'Senior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Lab 2', subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'] },
  { id: 'cls-06', name: 'SS 3 Science', level: 'Senior', classTeacherId: '', classTeacherName: 'Unassigned', studentCount: 0, capacity: 35, room: 'Lab 3', subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'] },
];

export interface SchoolState {
  // Institutional / Company Data (Preserved)
  settings: SchoolSettings;
  feeStructures: FeeStructure[];
  subjects: Subject[];
  classes: SchoolClass[];

  // Dynamic Records (Initialized Clean / Empty)
  students: Student[];
  teachers: Teacher[];
  payments: PaymentRecord[];
  attendance: AttendanceEntry[];
  grades: GradeItem[];
  timetable: TimetableSlot[];
  announcements: Announcement[];
  applicants: AdmissionApplicant[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  auditLogs: AuditLog[];
  behavioralRatings: BehavioralRating[];

  // Student Actions
  addStudent: (data: Partial<Student> & { firstName: string; lastName: string; classId: string }) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Teacher Actions
  addTeacher: (data: Partial<Teacher> & { name: string; email: string; department: Teacher['department'] }) => Teacher;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Class Actions
  addClass: (data: Partial<SchoolClass> & { name: string; level: 'Junior' | 'Senior'; room: string }) => SchoolClass;
  updateClass: (id: string, updates: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;
  promoteStudents: (fromClassId: string, toClassId: string) => number;

  // Attendance Actions
  markAttendance: (entries: AttendanceEntry[]) => void;
  updateAttendanceEntry: (id: string, status: 'Present' | 'Absent' | 'Late', remark?: string) => void;

  // Grades Actions
  saveGrade: (data: Partial<GradeItem> & { studentId: string; subject: string; term: GradeItem['term']; session: string; ca1: number; ca2: number; exam: number }) => GradeItem;
  deleteGrade: (id: string) => void;
  saveBehavioralRating: (rating: Omit<BehavioralRating, 'id'>) => BehavioralRating;

  // Fee / Invoice Actions
  addPayment: (data: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => PaymentRecord;

  // Timetable Actions (With automated clash/conflict detection)
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => { success: boolean; conflictMessage?: string; slot?: TimetableSlot };
  updateTimetableSlot: (id: string, updates: Partial<TimetableSlot>) => { success: boolean; conflictMessage?: string };
  deleteTimetableSlot: (id: string) => void;

  // Announcement Actions
  addAnnouncement: (data: Omit<Announcement, 'id' | 'date'>) => Announcement;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;

  // Curriculum & Subject Actions
  addSubject: (data: Omit<Subject, 'id'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Admissions Pipeline Actions
  addApplicant: (data: Omit<AdmissionApplicant, 'id' | 'applicationNo' | 'applicationDate'>) => AdmissionApplicant;
  updateApplicantStatus: (id: string, status: AdmissionApplicant['status'], score?: number) => void;
  enrollApplicant: (id: string, classId: string) => Student | null;

  // LMS Assignments Actions
  addAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => Assignment;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  submitAssignment: (data: Omit<AssignmentSubmission, 'id' | 'submissionDate'>) => AssignmentSubmission;
  gradeSubmission: (id: string, score: number, feedback: string) => void;

  // Audit Logs & Settings
  addAuditLog: (category: AuditLog['category'], action: string, details: string) => void;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  clearAllRecords: () => void;
  restoreStore: (data: Partial<SchoolState>) => void;
  resetToDefaults: () => void;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
      // Company / Institution Info (kept intact)
      settings: mockSchoolSettings,
      feeStructures: mockFeeStructures,
      subjects: mockSubjects,
      classes: initialClasses,

      // Initialized clean without hardcoded students/invoices/attendance/grades
      students: [],
      teachers: [],
      payments: [],
      attendance: [],
      grades: [],
      timetable: [],
      announcements: [],
      applicants: [],
      assignments: [],
      submissions: [],
      behavioralRatings: [],
      auditLogs: [
        {
          id: 'log-init',
          timestamp: new Date().toLocaleString('en-GB'),
          action: 'System Initialized',
          category: 'Settings',
          performedBy: 'System Administrator',
          details: 'Federal Excellence Academy SIS operational environment ready.',
        },
      ],

      // STUDENT ACTIONS
      addStudent: (data) => {
        const state = get();
        const count = state.students.length + 1;
        const currentYear = new Date().getFullYear();
        const admissionNo = `FEA/${currentYear}/${String(count).padStart(3, '0')}`;
        const targetClass = state.classes.find((c) => c.id === data.classId);

        const newStudent: Student = {
          id: `stu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          admissionNo,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: `${data.firstName} ${data.lastName}`,
          gender: data.gender || 'Male',
          dob: data.dob || '2010-05-15',
          classId: data.classId,
          className: targetClass ? targetClass.name : data.className || 'JSS 1A',
          guardianName: data.guardianName || 'Guardian',
          guardianPhone: data.guardianPhone || '+234 800 000 0000',
          guardianEmail: data.guardianEmail || 'parent@example.com',
          address: data.address || state.settings.address,
          bloodGroup: data.bloodGroup || 'O+',
          stateOfOrigin: data.stateOfOrigin || state.settings.state,
          lga: data.lga || 'Ikeja',
          avatar: `https://images.unsplash.com/photo-${1530000000000 + (count % 80)}?w=150&auto=format&fit=crop&q=80`,
          status: data.status || 'Active',
          feeBalance: data.feeBalance ?? 180000,
          attendancePercentage: 100,
          parentId: `par-${count}`,
          enrolledDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        };

        // Increment studentCount in class
        const updatedClasses = state.classes.map((cls) =>
          cls.id === data.classId ? { ...cls, studentCount: cls.studentCount + 1 } : cls
        );

        set((s) => ({
          students: [newStudent, ...s.students],
          classes: updatedClasses,
        }));

        get().addAuditLog('Students', 'Student Enrolled', `Enrolled ${newStudent.fullName} (${newStudent.admissionNo}) into ${newStudent.className}`);
        return newStudent;
      },

      updateStudent: (id, updates) => {
        set((state) => ({
          students: state.students.map((s) => {
            if (s.id !== id) return s;
            const updated = { ...s, ...updates };
            if (updates.firstName || updates.lastName) {
              updated.fullName = `${updated.firstName} ${updated.lastName}`;
            }
            return updated;
          }),
        }));
        get().addAuditLog('Students', 'Student Updated', `Updated records for student ID ${id}`);
      },

      deleteStudent: (id) => {
        const student = get().students.find((s) => s.id === id);
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
          classes: state.classes.map((c) =>
            c.id === student?.classId ? { ...c, studentCount: Math.max(0, c.studentCount - 1) } : c
          ),
        }));
        get().addAuditLog('Students', 'Student Deleted', `Removed student ${student?.fullName || id} from registry`);
      },

      // TEACHER ACTIONS
      addTeacher: (data) => {
        const state = get();
        const count = state.teachers.length + 1;
        const staffId = `FEA/STF/${String(count).padStart(3, '0')}`;
        const newTeacher: Teacher = {
          id: `tch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          staffId,
          name: data.name,
          email: data.email,
          phone: data.phone || '+234 800 000 0000',
          gender: data.gender || 'Male',
          qualification: data.qualification || 'B.Sc (Ed)',
          department: data.department,
          subjects: data.subjects || ['General Studies'],
          assignedClasses: data.assignedClasses || ['JSS 1A'],
          avatar: `https://images.unsplash.com/photo-${1500000000000 + (count % 80)}?w=150&auto=format&fit=crop&q=80`,
          status: data.status || 'Active',
          dateJoined: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        };

        set((s) => ({ teachers: [newTeacher, ...s.teachers] }));
        get().addAuditLog('Staff', 'Faculty Appointed', `Added teacher ${newTeacher.name} (${newTeacher.department})`);
        return newTeacher;
      },

      updateTeacher: (id, updates) => {
        set((state) => ({
          teachers: state.teachers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        get().addAuditLog('Staff', 'Faculty Updated', `Updated details for staff ID ${id}`);
      },

      deleteTeacher: (id) => {
        const teacher = get().teachers.find((t) => t.id === id);
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
          classes: state.classes.map((c) =>
            c.classTeacherId === id ? { ...c, classTeacherId: '', classTeacherName: 'Unassigned' } : c
          ),
        }));
        get().addAuditLog('Staff', 'Faculty Archived', `Archived staff member ${teacher?.name || id}`);
      },

      // CLASS ACTIONS & STUDENT PROMOTION
      addClass: (data) => {
        const teacher = get().teachers.find((t) => t.id === data.classTeacherId);
        const newClass: SchoolClass = {
          id: `cls-${Date.now()}`,
          name: data.name,
          level: data.level,
          classTeacherId: data.classTeacherId || '',
          classTeacherName: teacher ? teacher.name : 'Unassigned',
          studentCount: 0,
          capacity: data.capacity || 35,
          room: data.room,
          subjects: data.subjects || ['Mathematics', 'English Language'],
        };
        set((s) => ({ classes: [...s.classes, newClass] }));
        get().addAuditLog('Academics', 'Class Created', `Created classroom arm ${newClass.name} (${newClass.room})`);
        return newClass;
      },

      updateClass: (id, updates) => {
        set((state) => ({
          classes: state.classes.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
        get().addAuditLog('Academics', 'Class Updated', `Updated class configuration for ID ${id}`);
      },

      deleteClass: (id) => {
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        }));
        get().addAuditLog('Academics', 'Class Removed', `Removed classroom arm ID ${id}`);
      },

      promoteStudents: (fromClassId, toClassId) => {
        const state = get();
        const fromClass = state.classes.find((c) => c.id === fromClassId);
        const toClass = state.classes.find((c) => c.id === toClassId);
        if (!fromClass || !toClass) return 0;

        let promotedCount = 0;
        const updatedStudents = state.students.map((student) => {
          if (student.classId === fromClassId && student.status === 'Active') {
            promotedCount++;
            return {
              ...student,
              classId: toClass.id,
              className: toClass.name,
            };
          }
          return student;
        });

        const updatedClasses = state.classes.map((cls) => {
          if (cls.id === fromClassId) {
            return { ...cls, studentCount: Math.max(0, cls.studentCount - promotedCount) };
          }
          if (cls.id === toClassId) {
            return { ...cls, studentCount: cls.studentCount + promotedCount };
          }
          return cls;
        });

        set({ students: updatedStudents, classes: updatedClasses });
        get().addAuditLog('Academics', 'Academic Promotion', `Promoted ${promotedCount} students from ${fromClass.name} to ${toClass.name}`);
        return promotedCount;
      },

      // ATTENDANCE ACTIONS
      markAttendance: (entries) => {
        set((state) => {
          const entryMap = new Map(state.attendance.map((e) => [`${e.studentId}_${e.date}`, e]));
          for (const e of entries) {
            entryMap.set(`${e.studentId}_${e.date}`, e);
          }
          return { attendance: Array.from(entryMap.values()) };
        });
        get().addAuditLog('Academics', 'Attendance Submitted', `Recorded roll call for ${entries.length} entries`);
      },

      updateAttendanceEntry: (id, status, remark) => {
        set((state) => ({
          attendance: state.attendance.map((a) => (a.id === id ? { ...a, status, remark: remark ?? a.remark } : a)),
        }));
      },

      // GRADES ACTIONS
      saveGrade: (data) => {
        const total = data.ca1 + data.ca2 + data.exam;
        let grade: GradeItem['grade'] = 'F';
        let remark = 'Fail';

        if (total >= 75) { grade = 'A'; remark = 'Distinction / Excellent'; }
        else if (total >= 65) { grade = 'B'; remark = 'Very Good'; }
        else if (total >= 50) { grade = 'C'; remark = 'Credit'; }
        else if (total >= 45) { grade = 'D'; remark = 'Pass'; }
        else if (total >= 40) { grade = 'E'; remark = 'Fair'; }

        const student = get().students.find((s) => s.id === data.studentId);
        const gradeItem: GradeItem = {
          id: data.id || `grd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          studentId: data.studentId,
          studentName: student?.fullName || data.studentName || 'Student',
          admissionNo: student?.admissionNo || data.admissionNo || '',
          classId: student?.classId || data.classId || '',
          subject: data.subject,
          term: data.term,
          session: data.session,
          ca1: data.ca1,
          ca2: data.ca2,
          exam: data.exam,
          total,
          grade,
          remark,
        };

        set((state) => {
          const idx = state.grades.findIndex(
            (g) =>
              g.id === gradeItem.id ||
              (g.studentId === gradeItem.studentId &&
                g.subject === gradeItem.subject &&
                g.term === gradeItem.term &&
                g.session === gradeItem.session)
          );
          if (idx >= 0) {
            const copy = [...state.grades];
            copy[idx] = gradeItem;
            return { grades: copy };
          }
          return { grades: [gradeItem, ...state.grades] };
        });

        get().addAuditLog('Academics', 'Score Recorded', `Recorded ${gradeItem.subject} score (${gradeItem.total} - ${gradeItem.grade}) for ${gradeItem.studentName}`);
        return gradeItem;
      },

      deleteGrade: (id) => {
        set((state) => ({ grades: state.grades.filter((g) => g.id !== id) }));
      },

      saveBehavioralRating: (ratingData) => {
        const ratingId = `beh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newRating: BehavioralRating = {
          id: ratingId,
          ...ratingData,
        };

        set((state) => {
          const idx = (state.behavioralRatings || []).findIndex(
            (b) =>
              b.studentId === newRating.studentId &&
              b.term === newRating.term &&
              b.session === newRating.session
          );
          if (idx >= 0) {
            const copy = [...(state.behavioralRatings || [])];
            copy[idx] = { ...copy[idx], ...newRating, id: copy[idx].id };
            return { behavioralRatings: copy };
          }
          return { behavioralRatings: [newRating, ...(state.behavioralRatings || [])] };
        });

        get().addAuditLog(
          'Academics',
          'Behavioral Assessment Saved',
          `Updated affective and psychomotor ratings for student ${ratingData.studentId} (${ratingData.term} ${ratingData.session})`
        );
        return newRating;
      },

      // FEE & PAYMENT ACTIONS
      addPayment: (data) => {
        const state = get();
        const receiptNumber = `RCP-${new Date().getFullYear()}-${String(state.payments.length + 1001)}`;
        const newRecord: PaymentRecord = {
          id: `pmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          receiptNumber,
          ...data,
        };

        set((s) => ({
          payments: [newRecord, ...s.payments],
          students: s.students.map((stu) =>
            stu.id === data.studentId
              ? { ...stu, feeBalance: Math.max(0, stu.feeBalance - data.amountPaid) }
              : stu
          ),
        }));

        get().addAuditLog('Finance', 'Payment Received', `Recorded payment of ₦${data.amountPaid.toLocaleString()} (${receiptNumber}) for ${data.studentName}`);
        return newRecord;
      },

      // TIMETABLE ACTIONS WITH CLASH / CONFLICT DETECTION
      addTimetableSlot: (slotData) => {
        const state = get();

        // 1. Check for Teacher Clash: Is this teacher already teaching another class in the same day and period?
        if (slotData.teacherId) {
          const teacherClash = state.timetable.find(
            (s) =>
              s.day === slotData.day &&
              s.period === slotData.period &&
              s.teacherId === slotData.teacherId
          );
          if (teacherClash) {
            return {
              success: false,
              conflictMessage: `Teacher Conflict: ${slotData.teacherName} is already assigned to ${teacherClash.className} (${teacherClash.subject}) on ${slotData.day} Period ${slotData.period}.`,
            };
          }
        }

        // 2. Check for Room Clash: Is this room already in use during this period?
        if (slotData.room) {
          const roomClash = state.timetable.find(
            (s) =>
              s.day === slotData.day &&
              s.period === slotData.period &&
              s.room.toLowerCase() === slotData.room.toLowerCase()
          );
          if (roomClash) {
            return {
              success: false,
              conflictMessage: `Room Conflict: "${slotData.room}" is already booked by ${roomClash.className} on ${slotData.day} Period ${slotData.period}.`,
            };
          }
        }

        // 3. Check for Class Clash: Does this class already have a subject in this period?
        const classClash = state.timetable.find(
          (s) =>
            s.day === slotData.day &&
            s.period === slotData.period &&
            s.classId === slotData.classId
        );
        if (classClash) {
          return {
            success: false,
            conflictMessage: `Classroom Conflict: ${slotData.className} already has "${classClash.subject}" scheduled on ${slotData.day} Period ${slotData.period}.`,
          };
        }

        const newSlot: TimetableSlot = {
          id: `slot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ...slotData,
        };

        set((s) => ({ timetable: [...s.timetable, newSlot] }));
        get().addAuditLog('Academics', 'Timetable Slot Added', `Scheduled ${newSlot.subject} for ${newSlot.className} on ${newSlot.day} Period ${newSlot.period}`);
        return { success: true, slot: newSlot };
      },

      updateTimetableSlot: (id, updates) => {
        set((state) => ({
          timetable: state.timetable.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
        return { success: true };
      },

      deleteTimetableSlot: (id) => {
        set((state) => ({ timetable: state.timetable.filter((s) => s.id !== id) }));
      },

      // ANNOUNCEMENTS
      addAnnouncement: (data) => {
        const newAnnouncement: Announcement = {
          id: `ann-${Date.now()}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          ...data,
        };
        set((s) => ({ announcements: [newAnnouncement, ...s.announcements] }));
        get().addAuditLog('Settings', 'Announcement Published', `Published notice: "${newAnnouncement.title}"`);
        return newAnnouncement;
      },

      deleteAnnouncement: (id) => {
        set((state) => ({ announcements: state.announcements.filter((a) => a.id !== id) }));
      },

      togglePinAnnouncement: (id) => {
        set((state) => ({
          announcements: state.announcements.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)),
        }));
      },

      // CURRICULUM & SUBJECTS
      addSubject: (data) => {
        const newSubject: Subject = {
          id: `sub-${Date.now()}`,
          ...data,
        };
        set((s) => ({ subjects: [...s.subjects, newSubject] }));
        get().addAuditLog('Academics', 'Subject Created', `Added curriculum subject ${newSubject.name} (${newSubject.code})`);
        return newSubject;
      },

      updateSubject: (id, updates) => {
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteSubject: (id) => {
        set((state) => ({ subjects: state.subjects.filter((s) => s.id !== id) }));
      },

      // ADMISSIONS PIPELINE
      addApplicant: (data) => {
        const state = get();
        const count = state.applicants.length + 1;
        const applicationNo = `ADM/${new Date().getFullYear()}/${String(count).padStart(3, '0')}`;
        const newApplicant: AdmissionApplicant = {
          id: `app-${Date.now()}`,
          applicationNo,
          applicationDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          ...data,
        };
        set((s) => ({ applicants: [newApplicant, ...s.applicants] }));
        get().addAuditLog('Students', 'Admission Application', `Received application ${applicationNo} for ${newApplicant.studentName}`);
        return newApplicant;
      },

      updateApplicantStatus: (id, status, score) => {
        set((state) => ({
          applicants: state.applicants.map((a) => {
            if (a.id !== id) return a;
            const updated = { ...a, status };
            if (score !== undefined) updated.entranceScore = score;
            return updated;
          }),
        }));
        get().addAuditLog('Students', 'Admission Status Updated', `Updated applicant ${id} to ${status}`);
      },

      enrollApplicant: (id, classId) => {
        const applicant = get().applicants.find((a) => a.id === id);
        if (!applicant) return null;

        const names = applicant.studentName.split(' ');
        const firstName = names[0];
        const lastName = names.slice(1).join(' ') || 'Candidate';

        const newStudent = get().addStudent({
          firstName,
          lastName,
          classId,
          gender: applicant.gender,
          guardianName: applicant.guardianName,
          guardianPhone: applicant.guardianPhone,
          guardianEmail: applicant.guardianEmail,
          status: 'Active',
        });

        set((state) => ({
          applicants: state.applicants.map((a) => (a.id === id ? { ...a, status: 'Enrolled' } : a)),
        }));

        get().addAuditLog('Students', 'Applicant Matriculated', `Applicant ${applicant.studentName} matriculated into class ID ${classId}`);
        return newStudent;
      },

      // LMS ASSIGNMENTS & HOMEWORK
      addAssignment: (data) => {
        const newAssignment: Assignment = {
          id: `asg-${Date.now()}`,
          createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          ...data,
        };
        set((s) => ({ assignments: [newAssignment, ...s.assignments] }));
        get().addAuditLog('Academics', 'Assignment Created', `Created assignment: ${newAssignment.title} (${newAssignment.className})`);
        return newAssignment;
      },

      updateAssignment: (id, updates) => {
        set((state) => ({
          assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }));
      },

      deleteAssignment: (id) => {
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
          submissions: state.submissions.filter((s) => s.assignmentId !== id),
        }));
      },

      submitAssignment: (data) => {
        const newSubmission: AssignmentSubmission = {
          id: `subm-${Date.now()}`,
          submissionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          ...data,
        };
        set((s) => ({ submissions: [newSubmission, ...s.submissions] }));
        return newSubmission;
      },

      gradeSubmission: (id, score, feedback) => {
        set((state) => ({
          submissions: state.submissions.map((sub) =>
            sub.id === id ? { ...sub, score, feedback, status: 'Graded' } : sub
          ),
        }));
        get().addAuditLog('Academics', 'Assignment Graded', `Graded submission ID ${id}: ${score} pts`);
      },

      // AUDIT LOGS & SETTINGS
      addAuditLog: (category, action, details) => {
        const newLog: AuditLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toLocaleString('en-GB'),
          action,
          category,
          performedBy: 'Portal Administrator',
          details,
        };
        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs.slice(0, 99)],
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
        get().addAuditLog('Settings', 'School Profile Updated', 'Institutional identity or term dates modified');
      },

      clearAllRecords: () => {
        set({
          students: [],
          teachers: [],
          payments: [],
          attendance: [],
          grades: [],
          timetable: [],
          announcements: [],
          applicants: [],
          assignments: [],
          submissions: [],
          behavioralRatings: [],
          classes: initialClasses.map((c) => ({ ...c, studentCount: 0, classTeacherId: '', classTeacherName: 'Unassigned' })),
        });
        get().addAuditLog('Settings', 'Database Cleared', 'Reset all student, teacher, invoice, and academic records to empty state');
      },

      restoreStore: (data) => {
        set((state) => ({
          ...state,
          ...(data.settings ? { settings: data.settings } : {}),
          ...(data.students ? { students: data.students } : {}),
          ...(data.teachers ? { teachers: data.teachers } : {}),
          ...(data.classes ? { classes: data.classes } : {}),
          ...(data.subjects ? { subjects: data.subjects } : {}),
          ...(data.payments ? { payments: data.payments } : {}),
          ...(data.attendance ? { attendance: data.attendance } : {}),
          ...(data.grades ? { grades: data.grades } : {}),
          ...(data.timetable ? { timetable: data.timetable } : {}),
          ...(data.announcements ? { announcements: data.announcements } : {}),
          ...(data.applicants ? { applicants: data.applicants } : {}),
          ...(data.assignments ? { assignments: data.assignments } : {}),
          ...(data.submissions ? { submissions: data.submissions } : {}),
          ...(data.feeStructures ? { feeStructures: data.feeStructures } : {}),
          ...(data.behavioralRatings ? { behavioralRatings: data.behavioralRatings } : {}),
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleString('en-GB'),
              action: 'Backup Restored',
              category: 'Settings',
              performedBy: 'System Administrator',
              details: 'System database restored successfully from external JSON backup file.',
            },
            ...state.auditLogs,
          ],
        }));
      },

      resetToDefaults: () => {
        set({
          settings: mockSchoolSettings,
          feeStructures: mockFeeStructures,
          subjects: mockSubjects,
          classes: initialClasses,
          students: [],
          teachers: [],
          payments: [],
          attendance: [],
          grades: [],
          timetable: [],
          announcements: [],
          applicants: [],
          assignments: [],
          submissions: [],
          behavioralRatings: [],
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleString('en-GB'),
              action: 'Factory Reset',
              category: 'Settings',
              performedBy: 'System Administrator',
              details: 'Reverted system database and institutional settings to factory defaults.',
            },
          ],
        });
      },
    }),
    {
      name: 'fea_sis_zustand_store_v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
