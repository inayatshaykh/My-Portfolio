import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Mail, Phone, Trash2, Eye, CheckCircle, Clock, Users,
  MessageSquare, BarChart3, X, Search, Download, CheckCheck,
  MessageCircle, StickyNote, Tag, TrendingUp, Inbox,
} from "lucide-react";
import { logout, isAuthenticated } from "@/lib/auth";
import {
  getSubmissions, markAsRead, markAllAsRead, deleteSubmission,
  updateStatus, updateNotes, exportCSV,
  type Submission, type SubmissionStatus,
} from "@/lib/submissions";

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "text-blue-400",  bg: "bg-blue-400/10 border-blue-400/30" },
  contacted: { label: "Contacted", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  closed:    { label: "Closed",    color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
};

const WHATSAPP_BASE = "https://wa.me/";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | SubmissionStatus>("all");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/admin"); return; }
    setSubmissions(getSubmissions());
  }, [navigate]);

  const refresh = () => setSubmissions(getSubmissions());

  const handleView = (s: Submission) => {
    markAsRead(s.id);
    const updated = { ...s, read: true };
    setSelected(updated);
    setNotes(updated.notes || "");
    setNotesSaved(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteSubmission(id);
    if (selected?.id === id) setSelected(null);
    setDeleteConfirm(null);
    refresh();
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    refresh();
  };

  const handleStatusChange = (id: string, status: SubmissionStatus) => {
    updateStatus(id, status);
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    refresh();
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    setNotesSaved(false);
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
      if (selected) {
        updateNotes(selected.id, val);
        setNotesSaved(true);
        refresh();
      }
    }, 800);
  };

  const handleLogout = () => { logout(); navigate("/admin"); };

  const unreadCount = submissions.filter((s) => !s.read).length;
  const newCount = submissions.filter((s) => s.status === "new").length;

  const filtered = submissions.filter((s) => {
    const matchRead = filter === "all" ? true : filter === "unread" ? !s.read : s.read;
    const matchStatus = statusFilter === "all" ? true : s.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.phone.includes(q) || s.message.toLowerCase().includes(q);
    return matchRead && matchStatus && matchSearch;
  });

  const stats = [
    { icon: Users,        label: "Total Leads",  value: submissions.length,                                                                    color: "text-primary" },
    { icon: Inbox,        label: "Unread",        value: unreadCount,                                                                           color: "text-blue-400" },
    { icon: TrendingUp,   label: "New Leads",     value: newCount,                                                                              color: "text-yellow-400" },
    { icon: CheckCircle,  label: "Closed",        value: submissions.filter((s) => s.status === "closed").length,                              color: "text-green-400" },
    { icon: BarChart3,    label: "This Month",    value: submissions.filter((s) => new Date(s.date).getMonth() === new Date().getMonth()).length, color: "text-purple-400" },
    { icon: MessageSquare,label: "Contacted",     value: submissions.filter((s) => s.status === "contacted").length,                           color: "text-orange-400" },
  ];

  const whatsappUrl = (phone: string, name: string) => {
    const clean = phone.replace(/\D/g, "");
    const num = clean.startsWith("91") ? clean : `91${clean}`;
    return `${WHATSAPP_BASE}${num}?text=${encodeURIComponent(`Hi ${name}, this is DevCraft team. We received your inquiry and would love to connect!`)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-display font-bold text-gradient-gold">DevCraft</a>
            <span className="text-muted-foreground text-sm font-body hidden sm:block">/ Admin Dashboard</span>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportCSV(submissions)}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-body text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-3 py-1.5"
              title="Export all leads as CSV"
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut size={16} /> <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <s.icon size={16} className={`${s.color} mb-2`} />
              <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground font-body mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, phone or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Read filter */}
          <div className="flex items-center gap-1.5">
            {(["all", "unread", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold font-body transition-colors capitalize ${
                  filter === f ? "bg-gradient-gold text-primary-foreground shadow-gold" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}{f === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
              </button>
            ))}
          </div>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-3 py-1.5 whitespace-nowrap"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {(["all", "new", "contacted", "closed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold font-body transition-colors capitalize border ${
                statusFilter === f
                  ? f === "all" ? "bg-gradient-gold text-primary-foreground border-transparent shadow-gold"
                    : `${STATUS_CONFIG[f as SubmissionStatus].color} ${STATUS_CONFIG[f as SubmissionStatus].bg}`
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All Status" : STATUS_CONFIG[f as SubmissionStatus].label}
            </button>
          ))}
          <span className="text-xs text-muted-foreground font-body ml-auto">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* List — 2 cols */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-muted-foreground font-body"
              >
                <Inbox size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">{search ? "No results found." : "No submissions yet."}</p>
                {search && <button onClick={() => setSearch("")} className="text-xs text-primary mt-2 hover:underline">Clear search</button>}
              </motion.div>
            ) : (
              filtered.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/40 ${
                    selected?.id === s.id ? "border-primary shadow-gold" : "border-border"
                  } ${!s.read ? "border-l-[3px] border-l-primary" : ""}`}
                  onClick={() => handleView(s)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!s.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                        <span className="font-display font-bold text-foreground text-sm truncate">{s.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${STATUS_CONFIG[s.status].color} ${STATUS_CONFIG[s.status].bg} flex-shrink-0`}>
                          {STATUS_CONFIG[s.status].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-body mb-1.5">
                        <Mail size={11} /> <span className="truncate">{s.email}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body line-clamp-2">{s.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground font-body whitespace-nowrap">
                        {new Date(s.date).toLocaleDateString()}
                      </span>
                      {s.notes && <StickyNote size={11} className="text-yellow-400" title="Has notes" />}
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(s.id); }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete submission"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Detail panel — 3 cols */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card border border-border rounded-xl p-6 sticky top-24"
                >
                  {/* Detail header */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-display font-bold text-foreground">{selected.name}</h2>
                      <span className="text-xs text-muted-foreground font-body">
                        {new Date(selected.date).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close detail"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Contact info */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-background rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body mb-1">
                        <Mail size={12} className="text-primary" /> Email
                      </div>
                      <p className="text-sm text-foreground font-body truncate">{selected.email}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body mb-1">
                        <Phone size={12} className="text-primary" /> Phone
                      </div>
                      <p className="text-sm text-foreground font-body">{selected.phone}</p>
                    </div>
                  </div>

                  {/* Status selector */}
                  <div className="mb-5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body mb-2">
                      <Tag size={12} className="text-primary" /> Status
                    </div>
                    <div className="flex gap-2">
                      {(["new", "contacted", "closed"] as SubmissionStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(selected.id, st)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all capitalize ${
                            selected.status === st
                              ? `${STATUS_CONFIG[st].color} ${STATUS_CONFIG[st].bg} shadow-sm`
                              : "border-border text-muted-foreground hover:text-foreground bg-background"
                          }`}
                        >
                          {STATUS_CONFIG[st].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body uppercase tracking-widest mb-2">
                      <MessageSquare size={12} className="text-primary" /> Message
                    </div>
                    <div className="bg-background rounded-lg p-4 border border-border">
                      <p className="text-sm text-foreground font-body leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body uppercase tracking-widest">
                        <StickyNote size={12} className="text-primary" /> Internal Notes
                      </div>
                      {notesSaved && <span className="text-xs text-green-400 font-body">Saved ✓</span>}
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      placeholder="Add private notes about this lead..."
                      rows={3}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={`mailto:${selected.email}?subject=Re: Your inquiry to DevCraft`}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity min-w-[100px]"
                    >
                      <Mail size={14} /> Email
                    </a>
                    <a
                      href={whatsappUrl(selected.phone, selected.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[hsl(142,70%,40%)] text-white py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity min-w-[100px]"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <a
                      href={`tel:${selected.phone}`}
                      className="inline-flex items-center justify-center gap-2 border border-primary/40 text-primary py-2.5 px-4 rounded-md text-sm font-semibold hover:bg-primary/10 transition-colors"
                    >
                      <Phone size={14} /> Call
                    </a>
                    <button
                      onClick={() => setDeleteConfirm(selected.id)}
                      className="px-4 py-2.5 border border-destructive/40 text-destructive rounded-md text-sm font-semibold hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden lg:flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-xl"
                >
                  <Eye size={32} className="mb-3 opacity-20" />
                  <p className="text-sm font-body">Select a submission to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-gold"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-display font-bold text-foreground mb-2">Delete Submission?</h3>
              <p className="text-sm text-muted-foreground font-body mb-6">This action cannot be undone. The lead will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-border text-muted-foreground py-2.5 rounded-md text-sm font-semibold hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
