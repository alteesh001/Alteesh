import { useEffect, useState } from 'react';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type Patient = { id: string; fullName: string; fileNumber: string; phone: string; lastVisit: string; treatment: string; status: 'متابعة' | 'جديد' | 'مكتمل' };
export type Doctor = { id: string; name: string; specialty: string; room?: string; color: string; active: boolean };
export type Chair = { id: string; name: string; room: string; specialty?: string; color: string; active: boolean };
export type Appointment = { id: string; patientId: string; patientName: string; doctorId: string; doctorName: string; chairId: string; chairName: string; date: string; startTime: string; endTime: string; procedure: string; status: AppointmentStatus; notes: string; color: string };
export type Activity = { id: string; text: string; time: string; type: 'appointment' | 'patient' | 'team' | 'system' };
export type ClinicData = { patients: Patient[]; doctors: Doctor[]; chairs: Chair[]; appointments: Appointment[]; activities: Activity[]; clinicName: string };

const today = new Date();
const dateString = (offset = 0) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };

export const seedData: ClinicData = {
  clinicName: 'Alteesh Clinic',
  patients: [
    { id: 'p1', fullName: 'رنا خالد المصري', fileNumber: 'AL-2048', phone: '09 456 7821', lastVisit: dateString(-9), treatment: 'ترميم ضرس', status: 'متابعة' },
    { id: 'p2', fullName: 'محمد سامر الحمصي', fileNumber: 'AL-2017', phone: '09 821 3345', lastVisit: dateString(-21), treatment: 'تقويم أسنان', status: 'متابعة' },
    { id: 'p3', fullName: 'لينا ياسر الحلبي', fileNumber: 'AL-2092', phone: '09 117 9034', lastVisit: dateString(-3), treatment: 'تنظيف وتلميع', status: 'متابعة' },
    { id: 'p4', fullName: 'طارق أحمد العبد', fileNumber: 'AL-1984', phone: '09 633 1120', lastVisit: dateString(-45), treatment: 'زراعة سن', status: 'مكتمل' },
    { id: 'p5', fullName: 'نور الهدى شحادة', fileNumber: 'AL-2104', phone: '09 345 8117', lastVisit: dateString(-1), treatment: 'فحص أولي', status: 'جديد' },
    { id: 'p6', fullName: 'جود عبد الرحمن', fileNumber: 'AL-1976', phone: '09 722 4801', lastVisit: dateString(-14), treatment: 'معالجة لبية', status: 'متابعة' },
    { id: 'p7', fullName: 'سارة عارف النجار', fileNumber: 'AL-2112', phone: '09 948 2065', lastVisit: dateString(-7), treatment: 'تبييض أسنان', status: 'متابعة' },
  ],
  doctors: [
    { id: 'd1', name: 'د. يزن التيش', specialty: 'طب وترميم الأسنان', color: '#287f7b', active: true },
    { id: 'd2', name: 'د. ليان مراد', specialty: 'تقويم وتجميل الأسنان', color: '#d17a5c', active: true },
    { id: 'd3', name: 'د. قيس حداد', specialty: 'جراحة الفم والأسنان', color: '#7283a0', active: true },
  ],
  chairs: [
    { id: 'c1', name: 'الكرسي ١', room: 'الغرفة الزرقاء', color: '#287f7b', active: true },
    { id: 'c2', name: 'الكرسي ٢', room: 'الغرفة الرملية', color: '#d17a5c', active: true },
    { id: 'c3', name: 'الكرسي ٣', room: 'الغرفة الهادئة', color: '#7283a0', active: true },
  ],
  appointments: [
    { id: 'a1', patientId: 'p1', patientName: 'رنا خالد المصري', doctorId: 'd1', doctorName: 'د. يزن التيش', chairId: 'c1', chairName: 'الكرسي ١', date: dateString(), startTime: '09:00', endTime: '09:45', procedure: 'ترميم ضرس', status: 'confirmed', notes: 'السن ٢٦، حشوة تجميلية', color: '#287f7b' },
    { id: 'a2', patientId: 'p2', patientName: 'محمد سامر الحمصي', doctorId: 'd2', doctorName: 'د. ليان مراد', chairId: 'c2', chairName: 'الكرسي ٢', date: dateString(), startTime: '09:30', endTime: '10:30', procedure: 'مراجعة تقويم', status: 'scheduled', notes: '', color: '#d17a5c' },
    { id: 'a3', patientId: 'p3', patientName: 'لينا ياسر الحلبي', doctorId: 'd1', doctorName: 'د. يزن التيش', chairId: 'c1', chairName: 'الكرسي ١', date: dateString(), startTime: '10:15', endTime: '11:00', procedure: 'تنظيف وتلميع', status: 'in_progress', notes: 'حساسية خفيفة', color: '#287f7b' },
    { id: 'a4', patientId: 'p5', patientName: 'نور الهدى شحادة', doctorId: 'd3', doctorName: 'د. قيس حداد', chairId: 'c3', chairName: 'الكرسي ٣', date: dateString(), startTime: '11:00', endTime: '12:00', procedure: 'استشارة زراعة', status: 'scheduled', notes: '', color: '#7283a0' },
    { id: 'a5', patientId: 'p6', patientName: 'جود عبد الرحمن', doctorId: 'd3', doctorName: 'د. قيس حداد', chairId: 'c3', chairName: 'الكرسي ٣', date: dateString(), startTime: '13:00', endTime: '14:15', procedure: 'معالجة لبية', status: 'confirmed', notes: 'جلسة ثانية', color: '#7283a0' },
    { id: 'a6', patientId: 'p7', patientName: 'سارة عارف النجار', doctorId: 'd2', doctorName: 'د. ليان مراد', chairId: 'c2', chairName: 'الكرسي ٢', date: dateString(1), startTime: '10:00', endTime: '10:45', procedure: 'تبييض أسنان', status: 'scheduled', notes: '', color: '#d17a5c' },
  ],
  activities: [
    { id: 'act1', text: 'تم تأكيد موعد رنا خالد المصري', time: 'منذ ١٢ دقيقة', type: 'appointment' },
    { id: 'act2', text: 'تم تسجيل مريض جديد: نور الهدى شحادة', time: 'منذ ٣٥ دقيقة', type: 'patient' },
    { id: 'act3', text: 'تم تحديث موعد جود عبد الرحمن', time: 'منذ ساعة', type: 'appointment' },
    { id: 'act4', text: 'تمت إضافة جلسة جديدة إلى جدول د. ليان', time: 'أمس، ٤:٢٠ م', type: 'team' },
  ],
};

const STORAGE_KEY = 'alteesh-clinic-data-v1';
const readData = (): ClinicData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedData;
    const parsed = JSON.parse(saved) as ClinicData;
    if (parsed.clinicName === 'عيادة التيش لطب الأسنان' || parsed.clinicName === 'التيش') {
      return { ...parsed, clinicName: 'Alteesh Clinic' };
    }
    return parsed;
  } catch {
    return seedData;
  }
};

export function useClinicData() {
  const [data, setData] = useState<ClinicData>(readData);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  const update = (updater: (current: ClinicData) => ClinicData) => setData(current => updater(current));
  const addActivity = (text: string, type: Activity['type'] = 'system') => update(d => ({ ...d, activities: [{ id: `act-${Date.now()}`, text, time: 'الآن', type }, ...d.activities].slice(0, 12) }));
  return { data, setData, update, addActivity, reset: () => setData(seedData) };
}

export const formatArabicDate = (date: string) => new Intl.DateTimeFormat('ar-SY', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00`));
export const shortDate = (date: string) => new Intl.DateTimeFormat('ar-SY', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`));
export const statusLabels: Record<AppointmentStatus, string> = { scheduled: 'مجدول', confirmed: 'مؤكد', in_progress: 'قيد المعالجة', completed: 'مكتمل', cancelled: 'ملغى' };
export const statusStyles: Record<AppointmentStatus, string> = { scheduled: 'status-scheduled', confirmed: 'status-confirmed', in_progress: 'status-progress', completed: 'status-completed', cancelled: 'status-cancelled' };