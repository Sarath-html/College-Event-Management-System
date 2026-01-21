
import React, { useState, useMemo } from 'react';
import { Calendar, ShieldCheck, GraduationCap, Users, PlusCircle, CheckCircle, XCircle, Search, Filter, ArrowUpDown, UserCheck, Image as ImageIcon, Award, X, Printer, User as UserIcon, Settings, Save, Mail, Briefcase, Clock, AlertCircle, Laptop, Smartphone, MapPin, Camera, Activity, TrendingUp, BarChart3, ChevronRight, Zap, BookOpen, ChevronLeft, CalendarDays, Trash2, Send } from 'lucide-react';
import { User, Event, Registration, Role } from './types';
import { mockUsers as initialUsers, mockEvents, mockRegistrations } from './constants';

type ViewType = 'dashboard' | 'profile';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [user, setUser] = useState<User | null>(users[0]);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  
  // State for new event creation (Coordinator only)
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', imageUrl: '' });
  
  const [profileForm, setProfileForm] = useState({ 
    name: user?.name || '', 
    email: user?.email || '',
    avatarSeed: user?.name || 'default'
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Calendar Logic
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const updateEventStatus = (eventId: number, status: 'approved' | 'rejected') => {
    setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, status } : ev));
  };

  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm("CRITICAL ACTION: Are you sure you want to permanently delete this event? This will remove all student registrations.")) {
      setEvents(prev => prev.filter(ev => ev.id !== eventId));
      setRegistrations(prev => prev.filter(reg => reg.event_id !== eventId));
    }
  };

  const handlePublishEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) {
      alert("Please provide at least a title and a date.");
      return;
    }
    const item: Event = {
      id: Date.now(),
      ...newEvent,
      status: 'pending'
    };
    setEvents([...events, item]);
    setNewEvent({ title: '', description: '', date: '', imageUrl: '' });
    alert("EVENT PUBLISHED: Your request has been sent to the Admin for approval.");
  };

  const handleRegister = (eventId: number) => {
    if (registrations.some(r => r.user_id === user?.id && r.event_id === eventId)) return;
    const reg: Registration = {
      id: Date.now(),
      user_id: user!.id,
      event_id: eventId
    };
    setRegistrations([...registrations, reg]);
  };

  const handleCancelRegistration = (eventId: number) => {
    setRegistrations(prev => prev.filter(r => !(r.user_id === user?.id && r.event_id === eventId)));
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      const updatedUser = { ...user!, name: profileForm.name, email: profileForm.email };
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setUser(updatedUser);
      setIsSavingProfile(false);
    }, 800);
  };

  const switchRole = (role: Role) => {
    const foundUser = users.find(u => u.role === role);
    if (foundUser) {
      setUser(foundUser);
      setProfileForm({ name: foundUser.name, email: foundUser.email, avatarSeed: foundUser.name });
      setCurrentView('dashboard');
      setNewEvent({ title: '', description: '', date: '', imageUrl: '' });
    }
  };

  const getRegCount = (eventId: number) => registrations.filter(r => r.event_id === eventId).length;

  const processedEvents = useMemo(() => {
    const filtered = events.filter(ev => {
      const isVisibleToUser = user?.role === Role.STUDENT ? ev.status === 'approved' : true;
      if (!isVisibleToUser) return false;
      const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
      const matchesDate = !selectedDateFilter || ev.date === selectedDateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
    return [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchQuery, statusFilter, user, selectedDateFilter]);

  const changeMonth = (offset: number) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="w-full max-w-6xl py-6 min-h-screen text-slate-200">
      <header className="glass-card mb-8 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 border-slate-700/50">
        <div className="flex items-center gap-5 cursor-pointer" onClick={() => {setCurrentView('dashboard'); setSelectedDateFilter(null);}}>
          <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-900/40 border border-violet-400/30">
            <GraduationCap className="text-white w-7 h-7 fill-white/20" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase leading-none">College <span className="text-violet-500">Event</span></h1>
            <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] mt-1 uppercase">Management System</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
            {(Object.values(Role) as Role[]).map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`px-4 py-2 text-[9px] font-black uppercase rounded-xl transition-all tracking-widest ${
                  user?.role === role ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentView(currentView === 'dashboard' ? 'profile' : 'dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              currentView === 'profile' ? 'bg-white text-slate-900' : 'bg-slate-800 text-violet-400 border border-violet-900/50 hover:bg-slate-700'
            }`}
          >
            {currentView === 'profile' ? <><Activity size={16} /> Activity</> : <><UserIcon size={16} /> Config</>}
          </button>
        </div>
      </header>

      {currentView === 'dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-8 space-y-8">
            {/* Statistics Section */}
            {(user?.role === Role.ADMIN || user?.role === Role.COORDINATOR) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { label: user?.role === Role.ADMIN ? 'Campus Students' : 'My Followers', val: users.filter(u => u.role === Role.STUDENT).length, icon: Users, color: 'from-violet-600 to-indigo-700', shadow: 'shadow-violet-900/20' },
                  { label: user?.role === Role.ADMIN ? 'Event Registry' : 'Active Submissions', val: events.length, icon: BookOpen, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-900/20' },
                  { label: 'Participation', val: registrations.length, icon: TrendingUp, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-900/20' }
                ].map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-[2rem] p-8 text-white ${stat.shadow} relative overflow-hidden group border border-white/10`}>
                    <stat.icon className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700" size={120} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">{stat.label}</p>
                    <p className="text-5xl font-black leading-none">{stat.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Coordinator: Add New Event Section */}
            {user?.role === Role.COORDINATOR && (
              <div className="glass-card rounded-[2.5rem] p-10 border-slate-700/30">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-violet-600 rounded-2xl"><PlusCircle className="text-white" size={24} /></div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">Draft New Activity</h2>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Requires Admin Verification</p>
                    </div>
                 </div>
                 <form onSubmit={handlePublishEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Robot Wars 2026"
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-violet-500 transition-all"
                        value={newEvent.title}
                        onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Proposed Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-violet-500 transition-all [color-scheme:dark]"
                        value={newEvent.date}
                        onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Image URL (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-violet-500 transition-all"
                        value={newEvent.imageUrl}
                        onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        placeholder="Define the scope, rules and rewards..."
                        rows={3}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-violet-500 transition-all resize-none"
                        value={newEvent.description}
                        onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                       <button 
                        type="submit"
                        className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-violet-900/40"
                       >
                         <Send size={14} /> Request Publication
                       </button>
                    </div>
                 </form>
              </div>
            )}

            {/* Events Explorer Section */}
            <div className="glass-card rounded-[2.5rem] p-10 border-slate-700/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-violet-500 rounded-full"></div> 
                  {selectedDateFilter ? `Activity on ${selectedDateFilter}` : 'Campus Activities'}
                </h2>
                <div className="flex items-center gap-3">
                  {selectedDateFilter && (
                    <button 
                      onClick={() => setSelectedDateFilter(null)}
                      className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                    >
                      Clear Filter
                    </button>
                  )}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="SCAN..." 
                      className="bg-slate-900/80 border-none rounded-2xl px-12 py-3 text-[10px] font-black tracking-widest text-violet-400 focus:ring-2 focus:ring-violet-500 w-48 outline-none"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {processedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {processedEvents.map(ev => {
                    const isRegistered = registrations.some(r => r.user_id === user?.id && r.event_id === ev.id);
                    return (
                      <div key={ev.id} className="group relative bg-slate-900/40 rounded-[2rem] border border-slate-800/50 hover:border-violet-500/50 transition-all duration-500 overflow-hidden flex flex-col shadow-2xl">
                        <div className="h-56 relative overflow-hidden">
                          {ev.imageUrl ? (
                            <img src={ev.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                          ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center"><ImageIcon className="text-slate-700" size={48}/></div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                          <div className={`absolute top-6 left-6 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-2xl border ${
                            ev.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                            ev.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                            'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          }`}>
                            {ev.status}
                          </div>
                          
                          {/* Admin Event Cancellation Button */}
                          {user?.role === Role.ADMIN && (
                            <button 
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="absolute top-6 right-6 p-3 bg-rose-600/90 text-white rounded-xl shadow-xl hover:bg-rose-500 transition-all scale-90 hover:scale-100"
                              title="Delete Event"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        <div className="p-8 flex-grow">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">{ev.date}</span>
                            <span className="text-[10px] font-black text-slate-500 bg-slate-800/50 px-3 py-1 rounded-lg">{getRegCount(ev.id)} ENROLLED</span>
                          </div>
                          <h3 className="text-xl font-black text-white mb-4 group-hover:text-violet-400 transition-colors uppercase">{ev.title}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-medium mb-8">{ev.description}</p>
                          
                          {user?.role === Role.STUDENT && (
                            <div className="space-y-3">
                              {isRegistered ? (
                                <button 
                                  onClick={() => handleCancelRegistration(ev.id)}
                                  className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white flex items-center justify-center gap-2"
                                >
                                  <XCircle size={14} /> Withdraw participation
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleRegister(ev.id)}
                                  className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg bg-violet-600 text-white hover:bg-violet-500 shadow-violet-900/30"
                                >
                                  Join Event
                                </button>
                              )}
                            </div>
                          )}

                          {user?.role === Role.ADMIN && ev.status === 'pending' && (
                            <div className="grid grid-cols-2 gap-4 mt-2">
                               <button 
                                onClick={() => updateEventStatus(ev.id, 'approved')}
                                className="py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                               >
                                 <CheckCircle size={12} /> Approve
                               </button>
                               <button 
                                onClick={() => updateEventStatus(ev.id, 'rejected')}
                                className="py-3 bg-slate-800 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-900/40 hover:text-rose-400 border border-slate-700 transition-all flex items-center justify-center gap-2"
                               >
                                 <XCircle size={12} /> Reject
                               </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-900/20 rounded-[2rem] border-2 border-dashed border-slate-800">
                  <CalendarDays className="mx-auto text-slate-700 mb-4" size={48} />
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest">No activities recorded for this filter.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-[2.5rem] p-8 border-slate-700/30 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
                  <Calendar size={14} className="text-violet-500" /> Event Matrix
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => changeMonth(-1)} className="p-1.5 bg-slate-800 rounded-lg hover:bg-violet-600 transition-colors"><ChevronLeft size={14}/></button>
                  <span className="text-[9px] font-black uppercase tracking-widest w-24 text-center">{monthNames[currentMonth]} {currentYear}</span>
                  <button onClick={() => changeMonth(1)} className="p-1.5 bg-slate-800 rounded-lg hover:bg-violet-600 transition-colors"><ChevronRight size={14}/></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                  <div key={d} className="text-center text-[8px] font-black text-slate-600 py-2">{d}</div>
                ))}
                {Array.from({ length: firstDayOfMonth(currentMonth, currentYear) }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                {Array.from({ length: daysInMonth(currentMonth, currentYear) }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentYear}-${currentMonth + 1}-${day}`;
                  const hasEvents = events.some(e => e.date === dateStr && (user?.role !== Role.STUDENT || e.status === 'approved'));
                  const isSelected = selectedDateFilter === dateStr;
                  const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDateFilter(isSelected ? null : dateStr)}
                      className={`relative p-2 text-[9px] font-bold rounded-xl transition-all aspect-square flex items-center justify-center ${
                        isSelected ? 'bg-violet-600 text-white shadow-lg' : 
                        isToday ? 'bg-slate-700 text-violet-400 border border-violet-500/30' :
                        'hover:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {day}
                      {hasEvents && !isSelected && (
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-400 rounded-full shadow-[0_0_5px_rgba(167,139,250,0.8)]"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 border-slate-700/30">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-2">
                <Activity size={14} className="text-violet-500" /> System Pulse
              </h2>
              <div className="space-y-6">
                {registrations.slice(-5).reverse().map(reg => {
                  const u = users.find(mu => mu.id === reg.user_id);
                  const e = events.find(me => me.id === reg.event_id);
                  return (
                    <div key={reg.id} className="flex gap-4 items-center group">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden group-hover:border-violet-500 transition-colors">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u?.name}`} alt="" />
                      </div>
                      <div className="text-[10px] leading-tight">
                        <p className="font-black text-slate-300 uppercase tracking-wider">{u?.name}</p>
                        <p className="text-slate-500 mt-1">Confirmed for <span className="text-violet-400 font-bold">{e?.title}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-10 duration-700 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="glass-card rounded-[3rem] overflow-hidden border-slate-700/50 relative">
              <div className="h-44 bg-gradient-to-br from-violet-600 to-indigo-900"></div>
              <div className="px-10 pb-12 pt-20 text-center -mt-24">
                <div className="w-40 h-40 mx-auto rounded-[2.5rem] border-[10px] border-[#0f172a] bg-slate-800 overflow-hidden shadow-2xl relative group">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileForm.avatarSeed}`} className="w-full h-full transform group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-violet-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white mt-8 uppercase tracking-tighter">{user?.name}</h2>
                <div className="flex justify-center gap-3 mt-4">
                   <span className="px-4 py-1.5 bg-violet-500/10 text-violet-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-violet-500/20">{user?.role}</span>
                   <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 glass-card rounded-[3rem] p-12 border-slate-700/50">
            <div className="flex items-center gap-6 mb-12">
               <div className="bg-violet-600/20 p-4 rounded-3xl border border-violet-500/30 text-violet-400">
                  <Settings size={32} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">System Identity</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage your administrative credentials</p>
               </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { label: 'Full Legal Name', icon: UserIcon, val: profileForm.name, key: 'name' },
                  { label: 'Campus Email', icon: Mail, val: profileForm.email, key: 'email' },
                  { label: 'Avatar Encryption Key', icon: ImageIcon, val: profileForm.avatarSeed, key: 'avatarSeed' }
                ].map((input, i) => (
                  <div key={i} className={`space-y-3 ${i === 2 ? 'md:col-span-2' : ''}`}>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">{input.label}</label>
                    <div className="relative group">
                      <input.icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-400 transition-colors" size={20} />
                      <input 
                        type="text" 
                        value={input.val}
                        onChange={e => setProfileForm({...profileForm, [input.key]: e.target.value})}
                        className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-3xl pl-16 pr-8 py-5 text-white font-black text-sm outline-none focus:border-violet-500 transition-all focus:bg-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-10 border-t border-slate-800 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-600 tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" /> Institutional Security Active
                 </div>
                 <button 
                  type="submit" 
                  disabled={isSavingProfile}
                  className="bg-violet-600 text-white px-12 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-violet-500 shadow-2xl shadow-violet-900/40 transition-all active:scale-95 disabled:opacity-50"
                 >
                   {isSavingProfile ? 'SYNCING...' : 'Update Identity'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <footer className="mt-20 mb-10 text-center">
        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-slate-700 to-transparent mx-auto mb-8"></div>
        <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em]">College Event Management System v4.0</p>
      </footer>
    </div>
  );
};

export default App;
