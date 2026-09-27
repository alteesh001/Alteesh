import { useState, type FormEvent, type ReactNode } from 'react';
import { Check, Eye, EyeOff, LockKeyhole, LogIn, ShieldCheck, Stethoscope } from 'lucide-react';
import { readAuthConfig, saveAuthConfig, useClinicData, type AuthConfig, type AuthSession, type Doctor } from '@/lib/clinic-store';

type ClinicController = ReturnType<typeof useClinicData>;

export async function hashPassword(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function AuthLogo() {
  return <div className="mb-7 flex items-center justify-center gap-3">
    <div className="logo-mark"><img src={`${import.meta.env.BASE_URL}alteesh-clinic-logo.png`} alt="Alteesh Clinic logo" /></div>
    <div className="text-right"><div className="font-display text-lg font-bold text-primary">Alteesh Clinic</div><div className="text-xs text-muted-foreground">إدارة عيادة الأسنان</div></div>
  </div>;
}

function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <main dir="rtl" className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
    <div className="w-full max-w-md">
      <AuthLogo />
      <section className="panel overflow-hidden">
        <div className="border-b border-border px-6 py-6">
          <div className="mb-2 text-xs font-bold tracking-[.12em] text-primary">{eyebrow}</div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="space-y-4 px-6 py-6">{children}</div>
      </section>
      <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">بيانات الدخول محفوظة على هذا الجهاز فقط.</p>
    </div>
  </main>;
}

function PasswordField({ label, value, onChange, placeholder = 'كلمة المرور', autoFocus = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; autoFocus?: boolean }) {
  const [visible, setVisible] = useState(false);
  return <label className="block">
    <span className="mb-1.5 block text-xs font-bold text-muted-foreground">{label}</span>
    <div className="relative">
      <LockKeyhole size={16} className="pointer-events-none absolute right-3 top-3 text-muted-foreground" />
      <input required autoFocus={autoFocus} autoComplete="new-password" type={visible ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input-control pr-9 pl-10" />
      <button type="button" onClick={() => setVisible(current => !current)} className="absolute left-2.5 top-2.5 text-muted-foreground" aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button>
    </div>
  </label>;
}

function AuthError({ message }: { message: string }) {
  return message ? <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm leading-6 text-destructive">{message}</div> : null;
}

function SetupManager({ onComplete }: { onComplete: (config: AuthConfig) => void }) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 6) return setError('اختاري كلمة مرور من ٦ أحرف على الأقل.');
    if (password !== confirmation) return setError('كلمتا المرور غير متطابقتين.');
    const config = { managerPasswordHash: await hashPassword(password), managerName: 'مدير العيادة' };
    saveAuthConfig(config);
    onComplete(config);
  };
  return <AuthShell eyebrow="التهيئة الأولى" title="أنشئي كلمة مرور المدير" description="هذه الخطوة تحمي إدارة العيادة. بعد ذلك يمكنك إنشاء كلمات المرور المؤقتة للأطباء.">
    <form onSubmit={submit} className="space-y-4">
      <input type="text" name="username" autoComplete="username" value="manager" readOnly className="sr-only" tabIndex={-1} />
      <PasswordField label="كلمة مرور المدير" value={password} onChange={setPassword} placeholder="٦ أحرف أو أكثر" autoFocus />
      <PasswordField label="تأكيد كلمة المرور" value={confirmation} onChange={setConfirmation} placeholder="أعيدي كتابة كلمة المرور" />
      <AuthError message={error} />
      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-95"><ShieldCheck size={17} />حفظ وبدء استخدام التطبيق</button>
    </form>
  </AuthShell>;
}

function Login({ clinic, config, onLogin }: { clinic: ClinicController; config: AuthConfig; onLogin: (session: AuthSession) => void }) {
  const [role, setRole] = useState<'manager' | 'doctor'>('manager');
  const [doctorId, setDoctorId] = useState(clinic.data.doctors.find(d => d.active)?.id || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const doctors = clinic.data.doctors.filter(d => d.active);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const hash = await hashPassword(password);
    if (role === 'manager') {
      if (hash !== config.managerPasswordHash) return setError('كلمة مرور المدير غير صحيحة.');
      onLogin({ role: 'manager', displayName: config.managerName });
      return;
    }
    const doctor = clinic.data.doctors.find(d => d.id === doctorId);
    if (!doctor?.passwordHash) return setError('لم يفعّل المدير حساب هذا الطبيب بعد.');
    if (hash !== doctor.passwordHash) return setError('كلمة المرور غير صحيحة.');
    onLogin({ role: 'doctor', doctorId: doctor.id, displayName: doctor.name });
  };
  return <AuthShell eyebrow="دخول آمن" title="مرحباً بعودتك" description="اختاري نوع الحساب وسجّلي الدخول إلى مساحة العمل المناسبة لك.">
    <div className="grid grid-cols-2 gap-2 rounded-lg bg-secondary/70 p-1">
      <button type="button" onClick={() => { setRole('manager'); setError(''); }} className={`rounded-md px-3 py-2 text-sm font-bold transition ${role === 'manager' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}><ShieldCheck size={15} className="ml-1 inline" />المدير</button>
      <button type="button" onClick={() => { setRole('doctor'); setError(''); }} className={`rounded-md px-3 py-2 text-sm font-bold transition ${role === 'doctor' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}><Stethoscope size={15} className="ml-1 inline" />طبيب</button>
    </div>
    <form onSubmit={submit} className="space-y-4">
      <input type="text" name="username" autoComplete="username" value={role === 'manager' ? 'manager' : doctorId} readOnly className="sr-only" tabIndex={-1} />
      {role === 'doctor' && <label className="block"><span className="mb-1.5 block text-xs font-bold text-muted-foreground">الطبيب</span><select required value={doctorId} onChange={e => setDoctorId(e.target.value)} className="input-control">{doctors.length ? doctors.map(doctor => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>) : <option value="">لا يوجد أطباء نشطون</option>}</select></label>}
      <PasswordField label={role === 'manager' ? 'كلمة مرور المدير' : 'كلمة مرور الطبيب'} value={password} onChange={setPassword} autoFocus />
      <AuthError message={error} />
      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-95" disabled={role === 'doctor' && doctors.length === 0}><LogIn size={17} />تسجيل الدخول</button>
    </form>
  </AuthShell>;
}

function ChangeDoctorPassword({ doctor, clinic, onComplete }: { doctor: Doctor; clinic: ClinicController; onComplete: () => void }) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 6) return setError('اختاري كلمة مرور من ٦ أحرف على الأقل.');
    if (password !== confirmation) return setError('كلمتا المرور غير متطابقتين.');
    const passwordHash = await hashPassword(password);
    clinic.update(data => ({ ...data, doctors: data.doctors.map(item => item.id === doctor.id ? { ...item, passwordHash, mustChangePassword: false } : item) }));
    onComplete();
  };
  return <AuthShell eyebrow="خطوة مطلوبة" title="غيّري كلمة المرور" description={`هذه أول مرة تدخلين فيها بحساب ${doctor.name}. اختاري كلمة مرور شخصية لا يعرفها أحد غيرك.`}>
    <form onSubmit={submit} className="space-y-4">
      <input type="text" name="username" autoComplete="username" value={doctor.id} readOnly className="sr-only" tabIndex={-1} />
      <PasswordField label="كلمة المرور الجديدة" value={password} onChange={setPassword} placeholder="٦ أحرف أو أكثر" autoFocus />
      <PasswordField label="تأكيد كلمة المرور الجديدة" value={confirmation} onChange={setConfirmation} placeholder="أعيدي كتابة كلمة المرور" />
      <AuthError message={error} />
      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-95"><Check size={17} />حفظ كلمة المرور والمتابعة</button>
    </form>
  </AuthShell>;
}

export function AuthGate({ clinic, children }: { clinic: ClinicController; children: (session: AuthSession, logout: () => void) => ReactNode }) {
  const [config, setConfig] = useState<AuthConfig | null>(() => readAuthConfig());
  const [session, setSession] = useState<AuthSession | null>(null);
  if (!config) return <SetupManager onComplete={setConfig} />;
  if (!session) return <Login clinic={clinic} config={config} onLogin={setSession} />;
  if (session.role === 'doctor') {
    const doctor = clinic.data.doctors.find(item => item.id === session.doctorId);
    if (!doctor) return <Login clinic={clinic} config={config} onLogin={setSession} />;
    if (doctor.mustChangePassword) return <ChangeDoctorPassword doctor={doctor} clinic={clinic} onComplete={() => setSession(current => current ? { ...current } : current)} />;
  }
  return <>{children(session, () => setSession(null))}</>;
}