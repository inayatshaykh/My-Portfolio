import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Mail, Phone, Trash2, Eye, CheckCircle, Clock, Users, MessageSquare, BarChart3, X } from "lucide-react";
import { logout, isAuthenticated } from "@/lib/auth";
import { getSubmissions, markAsRead, deleteSubmission, type Submission } from "@/lib/submissions";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/admin"); return; }
    setSubmissions(getSubmissions());
  }, [navigate]);

  const refresh = () => setSubmissions(getSubmissions());

  const handleView = (s: Submission) => {
    markAsRead(s.id);
    setSelected({ ...s, read: true });
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteSubmission(id);
    if (selected?.id === id) setSelected(null);
    refresh();
  };

  const handleLogout = () => { logout(); navigate("/admin"); };

  const filtered = submissions.filter((s) =>
    filter === "all" ? true : filter === "unread" ? !s.read : s.read
  );

  const unreadCount = submissions.filter((s) => !s.read).length;

  const stats = [
    { icon: Users, label: "Total Leads", value: submissions.length },
    { icon: MessageSquare, label: "Unread", value: unreadCount },
    { icon: CheckCircle, label: "Read", value: submissions.length - unreadCount },
    { icon: BarChart3, label: "This Month", value: submissions.filter((s) => new Date(s.date).getMonth() === new Date().getMonth()).length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-display font-bold text-gradient-gold">DevCraft</a>
            <span className="text-muted-foreground text-sm font-body hidden sm:block">/ Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <s.icon size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground font-body">{s.label}</span>
              </div>
              <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-5">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold font-body transition-colors capitalize ${
                filter === f
                  ? "bg-gradient-gold text-primary-foreground shadow-gold"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Submissions list */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground font-body text-sm">
                No submissions yet.
              </div>
            ) : (
              filtered.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/40 ${
                    selected?.id === s.id ? "border-primary shadow-gold" : "border-border"
                  } ${!s.read ? "border-l-2 border-l-primary" : ""}`}
                  onClick={() => handleView(s)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!s.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                        <span className="font-display font-bold text-foreground text-sm truncate">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-body mb-2">
                        <Mail size={11} /> <span className="truncate">{s.email}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body line-clamp-2">{s.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground font-body whitespace-nowrap">
                        {new Date(s.date).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete submission"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24"
              >
                <div className="flex items-start justify-between mb-5">
                  <h2 className="text-lg font-display font-bold text-foreground">{selected.name}</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close detail"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <Mail size={14} className="text-primary" /> {selected.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <Phone size={14} className="text-primary" /> {selected.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <Clock size={14} className="text-primary" />
                    {new Date(selected.date).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <Eye size={14} className="text-primary" />
                    {selected.read ? "Read" : "Unread"}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-widest mb-2">Message</p>
                  <p className="text-sm text-foreground font-body leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Mail size={14} /> Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="px-4 py-2.5 border border-destructive/40 text-destructive rounded-md text-sm font-semibold hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
