import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { WeddingEvent, WeddingConfig } from '@/hooks/useWeddingData';
import {
  LogIn,
  LogOut,
  Loader2,
  Calendar,
  List,
  Users,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ScheduleRow = {
  id: string;
  event_id: string;
  time: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
};

type VenueRow = {
  id: string;
  event_id: string;
  category: string;
  name: string;
  address: string;
  maps_url: string;
  display_order: number;
};

type RSVPRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  attending: boolean;
  guest_count: number;
  message: string | null;
  events_attending: string | null;
  created_at: string;
};

type Tab = 'events' | 'schedules' | 'venues' | 'rsvps' | 'config';

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */
const card = 'rounded-2xl border border-[#e8e0d8] bg-white p-6 shadow-sm';
const inputCls =
  'w-full rounded-lg border border-[#e0d8cf] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#3a3230] placeholder:text-[#b5aba0] outline-none transition-colors focus:border-[#c5a880]';
const btnPrimary =
  'inline-flex items-center gap-2 rounded-lg bg-[#3a3230] px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-[#4e4543]';
const btnSecondary =
  'inline-flex items-center gap-2 rounded-lg border border-[#e0d8cf] bg-white px-4 py-2 text-sm text-[#6b5e56] transition-colors hover:bg-[#faf8f5]';
const btnDanger =
  'inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50';
const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#8a7e74]';

/* ------------------------------------------------------------------ */
/*  Admin Dashboard                                                    */
/* ------------------------------------------------------------------ */
export function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<Tab>('events');

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthError('');
    setLoggingIn(true);
    const cleanedEmail = email.trim();
    console.log(`Attempting login with email: "${cleanedEmail}"`);
    const { error } = await supabase.auth.signInWithPassword({ email: cleanedEmail, password });
    setLoggingIn(false);
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f2ee] p-6">
        <div className={card + ' max-w-md text-center'}>
          <h2 className="text-lg font-semibold text-[#3a3230]">Supabase not configured</h2>
          <p className="mt-2 text-sm text-[#8a7e74]">Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f2ee]">
        <Loader2 className="animate-spin text-[#c5a880]" size={36} />
      </div>
    );
  }

  /* ----------------------------- Login Screen ----------------------------- */
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f2ee] px-4">
        <form onSubmit={handleLogin} className={card + ' w-full max-w-sm'}>
          <h1 className="text-center text-2xl font-semibold text-[#3a3230]">Admin Login</h1>
          <p className="mt-1 text-center text-sm text-[#8a7e74]">Sign in to manage your wedding</p>

          <div className="mt-6">
            <label className={labelCls}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
              required
            />
          </div>

          {authError && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{authError}</p>
          )}

          <button type="submit" disabled={loggingIn} className={btnPrimary + ' mt-6 w-full justify-center'}>
            {loggingIn ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            {loggingIn ? 'Signing in…' : 'Sign in'}
          </button>

          <a
            href="/"
            className="mt-4 block text-center text-xs text-[#8a7e74] underline-offset-4 hover:underline"
          >
            ← Back to wedding site
          </a>
        </form>
      </div>
    );
  }

  /* ----------------------------- Dashboard ----------------------------- */
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'events', label: 'Events & Dates', icon: <Calendar size={16} /> },
    { id: 'schedules', label: 'Schedules', icon: <List size={16} /> },
    { id: 'venues', label: 'Venues', icon: <Settings size={16} /> },
    { id: 'rsvps', label: 'RSVPs', icon: <Users size={16} /> },
    { id: 'config', label: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f5f2ee]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-[#e8e0d8] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-[#8a7e74] hover:underline">← Site</a>
            <span className="text-[#e0d8cf]">|</span>
            <h1 className="text-lg font-semibold text-[#3a3230]">Wedding Admin</h1>
          </div>
          <button onClick={handleLogout} className={btnSecondary}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="border-b border-[#e8e0d8] bg-white">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${
                activeTab === t.id
                  ? 'border-[#c5a880] text-[#3a3230]'
                  : 'border-transparent text-[#8a7e74] hover:text-[#6b5e56]'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'schedules' && <SchedulesTab />}
        {activeTab === 'venues' && <VenuesTab />}
        {activeTab === 'rsvps' && <RSVPsTab />}
        {activeTab === 'config' && <ConfigTab />}
      </main>
    </div>
  );
}

/* ================================================================== */
/*  Events Tab                                                         */
/* ================================================================== */
function EventsTab() {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from('wedding_events')
      .select('*')
      .order('display_order', { ascending: true });
    setEvents((data as WeddingEvent[]) || []);
    setLoading(false);
  }

  function updateField(idx: number, field: string, value: any) {
    setEvents((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  }

  async function saveAll() {
    if (!supabase) return;
    setSaving(true);
    setMsg('');
    for (const evt of events) {
      const { error } = await supabase
        .from('wedding_events')
        .update({
          title: evt.title,
          subtitle: evt.subtitle,
          event_date: evt.event_date,
          countdown_target: evt.countdown_target,
          display_date_long: evt.display_date_long,
          display_date_short: evt.display_date_short,
          display_order: evt.display_order,
          is_active: (evt as any).is_active,
        })
        .eq('id', evt.id);
      if (error) {
        setMsg(`Error saving ${evt.title}: ${error.message}`);
        setSaving(false);
        return;
      }
    }
    setMsg('All events saved!');
    setSaving(false);
  }

  if (loading) return <Loader2 className="mx-auto animate-spin text-[#c5a880]" size={28} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#3a3230]">Wedding Events</h2>
        <button onClick={saveAll} disabled={saving} className={btnPrimary}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : 'Save All'}
        </button>
      </div>

      {msg && (
        <p
          className={`rounded-lg px-4 py-2 text-sm ${
            msg.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
          }`}
        >
          {msg}
        </p>
      )}

      {events.map((evt, idx) => (
        <div key={evt.id} className={card}>
          <h3 className="mb-4 text-lg font-semibold text-[#3a3230]">{evt.title || `Event ${idx + 1}`}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} value={evt.title} onChange={(e) => updateField(idx, 'title', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input className={inputCls} value={evt.subtitle || ''} onChange={(e) => updateField(idx, 'subtitle', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Event Date</label>
              <input type="date" className={inputCls} value={evt.event_date} onChange={(e) => updateField(idx, 'event_date', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Countdown Target (ISO)</label>
              <input className={inputCls} value={evt.countdown_target} onChange={(e) => updateField(idx, 'countdown_target', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Display Date (Long)</label>
              <input className={inputCls} value={evt.display_date_long || ''} onChange={(e) => updateField(idx, 'display_date_long', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Display Date (Short)</label>
              <input className={inputCls} value={evt.display_date_short || ''} onChange={(e) => updateField(idx, 'display_date_short', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Display Order</label>
              <input type="number" className={inputCls} value={evt.display_order} onChange={(e) => updateField(idx, 'display_order', Number(e.target.value))} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  Schedules Tab                                                      */
/* ================================================================== */
function SchedulesTab() {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [items, setItems] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeEventId, setActiveEventId] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    if (!supabase) return;
    setLoading(true);
    const [{ data: evts }, { data: scheds }] = await Promise.all([
      supabase.from('wedding_events').select('*').order('display_order'),
      supabase.from('wedding_schedule_items').select('*').order('display_order'),
    ]);
    const evtList = (evts as WeddingEvent[]) || [];
    setEvents(evtList);
    setItems((scheds as ScheduleRow[]) || []);
    if (evtList.length > 0 && !activeEventId) setActiveEventId(evtList[0].id);
    setLoading(false);
  }

  const filteredItems = items
    .filter((s) => s.event_id === activeEventId)
    .sort((a, b) => a.display_order - b.display_order);

  function updateItem(id: string, field: string, value: any) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  async function addItem() {
    if (!supabase || !activeEventId) return;
    const maxOrder = filteredItems.reduce((max, s) => Math.max(max, s.display_order), 0);
    const { data, error } = await supabase
      .from('wedding_schedule_items')
      .insert({ event_id: activeEventId, time: '00:00', title: 'New Item', description: '', icon: 'arrival', display_order: maxOrder + 1 })
      .select()
      .single();
    if (data) setItems((prev) => [...prev, data as ScheduleRow]);
    if (error) setMsg(`Error: ${error.message}`);
  }

  async function deleteItem(id: string) {
    if (!supabase) return;
    await supabase.from('wedding_schedule_items').delete().eq('id', id);
    setItems((prev) => prev.filter((s) => s.id !== id));
  }

  async function saveAll() {
    if (!supabase) return;
    setSaving(true);
    setMsg('');
    for (const item of filteredItems) {
      const { error } = await supabase
        .from('wedding_schedule_items')
        .update({ time: item.time, title: item.title, description: item.description, icon: item.icon, display_order: item.display_order })
        .eq('id', item.id);
      if (error) {
        setMsg(`Error: ${error.message}`);
        setSaving(false);
        return;
      }
    }
    setMsg('Schedule saved!');
    setSaving(false);
  }

  const iconOptions = ['arrival', 'drums', 'prayer', 'welcome', 'ceremony', 'ring', 'toast', 'dancing', 'dinner', 'sendoff'];

  if (loading) return <Loader2 className="mx-auto animate-spin text-[#c5a880]" size={28} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[#3a3230]">Schedule Items</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className={btnSecondary}>
            <Plus size={14} /> Add Item
          </button>
          <button onClick={saveAll} disabled={saving} className={btnPrimary}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Event filter tabs */}
      <div className="flex gap-2">
        {events.map((evt) => (
          <button
            key={evt.id}
            onClick={() => setActiveEventId(evt.id)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              activeEventId === evt.id
                ? 'border-[#c5a880] bg-[#c5a880]/10 text-[#3a3230]'
                : 'border-[#e0d8cf] text-[#8a7e74] hover:border-[#c5a880]/50'
            }`}
          >
            {evt.title}
          </button>
        ))}
      </div>

      {msg && (
        <p className={`rounded-lg px-4 py-2 text-sm ${msg.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </p>
      )}

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div key={item.id} className={card + ' flex flex-col gap-3 sm:flex-row sm:items-start'}>
            <div className="grid flex-1 gap-3 sm:grid-cols-6">
              <div className="sm:col-span-1">
                <label className={labelCls}>Time</label>
                <input className={inputCls} value={item.time} onChange={(e) => updateItem(item.id, 'time', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Title</label>
                <input className={inputCls} value={item.title} onChange={(e) => updateItem(item.id, 'title', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Description</label>
                <input className={inputCls} value={item.description || ''} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
              </div>
              <div className="sm:col-span-1">
                <label className={labelCls}>Icon</label>
                <select className={inputCls} value={item.icon} onChange={(e) => updateItem(item.id, 'icon', e.target.value)}>
                  {iconOptions.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1 pt-5">
              <button
                onClick={() => {
                  const prev = filteredItems.find((s) => s.display_order < item.display_order);
                  if (prev) {
                    updateItem(item.id, 'display_order', prev.display_order);
                    updateItem(prev.id, 'display_order', item.display_order);
                  }
                }}
                className={btnSecondary + ' !px-2'}
                title="Move up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => {
                  const next = filteredItems.find((s) => s.display_order > item.display_order);
                  if (next) {
                    updateItem(item.id, 'display_order', next.display_order);
                    updateItem(next.id, 'display_order', item.display_order);
                  }
                }}
                className={btnSecondary + ' !px-2'}
                title="Move down"
              >
                <ChevronDown size={14} />
              </button>
              <button onClick={() => deleteItem(item.id)} className={btnDanger + ' !px-2'} title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <p className="py-8 text-center text-sm text-[#8a7e74]">No schedule items for this event yet.</p>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Venues Tab                                                         */
/* ================================================================== */
function VenuesTab() {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [venues, setVenues] = useState<VenueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    if (!supabase) return;
    setLoading(true);
    const [{ data: evts }, { data: vens }] = await Promise.all([
      supabase.from('wedding_events').select('*').order('display_order'),
      supabase.from('wedding_venues').select('*').order('display_order'),
    ]);
    setEvents((evts as WeddingEvent[]) || []);
    setVenues((vens as VenueRow[]) || []);
    setLoading(false);
  }

  function updateVenue(id: string, field: string, value: any) {
    setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  }

  async function addVenue() {
    if (!supabase || events.length === 0) return;
    const maxOrder = venues.reduce((max, v) => Math.max(max, v.display_order), 0);
    const { data, error } = await supabase
      .from('wedding_venues')
      .insert({ event_id: events[0].id, category: 'reception', name: 'New Venue', address: '', maps_url: '', display_order: maxOrder + 1 })
      .select()
      .single();
    if (data) setVenues((prev) => [...prev, data as VenueRow]);
    if (error) setMsg(`Error: ${error.message}`);
  }

  async function deleteVenue(id: string) {
    if (!supabase) return;
    await supabase.from('wedding_venues').delete().eq('id', id);
    setVenues((prev) => prev.filter((v) => v.id !== id));
  }

  async function saveAll() {
    if (!supabase) return;
    setSaving(true);
    setMsg('');
    for (const v of venues) {
      const { error } = await supabase
        .from('wedding_venues')
        .update({ event_id: v.event_id, category: v.category, name: v.name, address: v.address, maps_url: v.maps_url, display_order: v.display_order })
        .eq('id', v.id);
      if (error) {
        setMsg(`Error: ${error.message}`);
        setSaving(false);
        return;
      }
    }
    setMsg('Venues saved!');
    setSaving(false);
  }

  if (loading) return <Loader2 className="mx-auto animate-spin text-[#c5a880]" size={28} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[#3a3230]">Venues</h2>
        <div className="flex gap-2">
          <button onClick={addVenue} className={btnSecondary}>
            <Plus size={14} /> Add Venue
          </button>
          <button onClick={saveAll} disabled={saving} className={btnPrimary}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {msg && (
        <p className={`rounded-lg px-4 py-2 text-sm ${msg.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </p>
      )}

      <div className="space-y-4">
        {venues.map((v) => (
          <div key={v.id} className={card}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={v.name} onChange={(e) => updateVenue(v.id, 'name', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={v.category} onChange={(e) => updateVenue(v.id, 'category', e.target.value)}>
                  <option value="intro">Introduction</option>
                  <option value="church">Church</option>
                  <option value="reception">Reception</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Linked Event</label>
                <select className={inputCls} value={v.event_id} onChange={(e) => updateVenue(v.id, 'event_id', e.target.value)}>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>{evt.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Address</label>
                <input className={inputCls} value={v.address} onChange={(e) => updateVenue(v.id, 'address', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Maps URL</label>
                <input className={inputCls} value={v.maps_url} onChange={(e) => updateVenue(v.id, 'maps_url', e.target.value)} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => deleteVenue(v.id)} className={btnDanger}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  RSVPs Tab                                                          */
/* ================================================================== */
function RSVPsTab() {
  const [rsvps, setRsvps] = useState<RSVPRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  async function fetchRSVPs() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from('wedding_rsvps')
      .select('*')
      .order('created_at', { ascending: false });
    setRsvps((data as RSVPRow[]) || []);
    setLoading(false);
  }

  if (loading) return <Loader2 className="mx-auto animate-spin text-[#c5a880]" size={28} />;

  const attending = rsvps.filter((r) => r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.guest_count, 0);
  const gusabaGuests = attending.filter((r) => r.events_attending === 'gusaba' || r.events_attending === 'both').reduce((sum, r) => sum + r.guest_count, 0);
  const whiteGuests = attending.filter((r) => r.events_attending === 'white' || r.events_attending === 'both').reduce((sum, r) => sum + r.guest_count, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#3a3230]">RSVP Submissions</h2>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className={card + ' text-center'}>
          <p className="text-3xl font-bold text-[#3a3230]">{rsvps.length}</p>
          <p className="mt-1 text-xs text-[#8a7e74]">Total Responses</p>
        </div>
        <div className={card + ' text-center'}>
          <p className="text-3xl font-bold text-green-700">{totalGuests}</p>
          <p className="mt-1 text-xs text-[#8a7e74]">Total Guests (Attending)</p>
        </div>
        <div className={card + ' text-center'}>
          <p className="text-3xl font-bold text-[#c5a880]">{gusabaGuests}</p>
          <p className="mt-1 text-xs text-[#8a7e74]">Gusaba Guests</p>
        </div>
        <div className={card + ' text-center'}>
          <p className="text-3xl font-bold text-[#c5a880]">{whiteGuests}</p>
          <p className="mt-1 text-xs text-[#8a7e74]">White Wedding Guests</p>
        </div>
      </div>

      {/* Table */}
      <div className={card + ' overflow-x-auto p-0'}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#e8e0d8] bg-[#faf8f5]">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#8a7e74]">Name</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#8a7e74]">Phone</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#8a7e74]">Attending</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#8a7e74]">Events</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#8a7e74]">Guests</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#8a7e74]">Message</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#8a7e74]">Date</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((r) => (
              <tr key={r.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5]">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-[#3a3230]">{r.full_name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#6b5e56]">{r.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      r.attending ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {r.attending ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#6b5e56] capitalize">{r.events_attending || 'both'}</td>
                <td className="px-4 py-3 text-[#6b5e56]">{r.guest_count}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-[#8a7e74]">{r.message || '—'}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#8a7e74]">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rsvps.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#8a7e74]">
                  No RSVPs received yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Config (Settings) Tab                                              */
/* ================================================================== */
function ConfigTab() {
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [configId, setConfigId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from('wedding_config').select('*').single();
    if (data) {
      setConfigId(data.id);
      setConfig(data as WeddingConfig);
    }
    setLoading(false);
  }

  function updateField(field: string, value: string) {
    setConfig((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function saveConfig() {
    if (!supabase || !config) return;
    setSaving(true);
    setMsg('');
    const { error } = await supabase
      .from('wedding_config')
      .update({
        partner1: config.partner1,
        partner2: config.partner2,
        couple_script: config.couple_script,
        initials: config.initials,
        hashtag: config.hashtag,
        cover_eyebrow: config.cover_eyebrow,
        cover_request: config.cover_request,
        cover_invitation: config.cover_invitation,
        cover_background_image: config.cover_background_image,
        audio_src: config.audio_src,
      })
      .eq('id', configId);
    if (error) {
      setMsg(`Error: ${error.message}`);
    } else {
      setMsg('Settings saved!');
    }
    setSaving(false);
  }

  if (loading) return <Loader2 className="mx-auto animate-spin text-[#c5a880]" size={28} />;
  if (!config) return <p className="text-center text-[#8a7e74]">No config found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#3a3230]">Wedding Settings</h2>
        <button onClick={saveConfig} disabled={saving} className={btnPrimary}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {msg && (
        <p className={`rounded-lg px-4 py-2 text-sm ${msg.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </p>
      )}

      <div className={card}>
        <h3 className="mb-4 font-semibold text-[#3a3230]">Couple Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Partner 1</label>
            <input className={inputCls} value={config.partner1} onChange={(e) => updateField('partner1', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Partner 2</label>
            <input className={inputCls} value={config.partner2} onChange={(e) => updateField('partner2', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Script (e.g. Dania & Kevin)</label>
            <input className={inputCls} value={config.couple_script} onChange={(e) => updateField('couple_script', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Initials (e.g. D&K)</label>
            <input className={inputCls} value={config.initials} onChange={(e) => updateField('initials', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Hashtag</label>
            <input className={inputCls} value={config.hashtag} onChange={(e) => updateField('hashtag', e.target.value)} />
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="mb-4 font-semibold text-[#3a3230]">Cover / Invitation Text</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Eyebrow Text</label>
            <input className={inputCls} value={config.cover_eyebrow} onChange={(e) => updateField('cover_eyebrow', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Request Line</label>
            <input className={inputCls} value={config.cover_request} onChange={(e) => updateField('cover_request', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Invitation Text</label>
            <input className={inputCls} value={config.cover_invitation} onChange={(e) => updateField('cover_invitation', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Background Image Path</label>
            <input className={inputCls} value={config.cover_background_image} onChange={(e) => updateField('cover_background_image', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Audio Source</label>
            <input className={inputCls} value={config.audio_src} onChange={(e) => updateField('audio_src', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
