export type SubmissionStatus = "new" | "contacted" | "closed";

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
  status: SubmissionStatus;
  notes: string;
}

const STORAGE_KEY = "contact_submissions";

export function getSubmissions(): Submission[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // Migrate old submissions that may not have status/notes
    return raw.map((s: Submission) => ({
      status: "new",
      notes: "",
      ...s,
    }));
  } catch {
    return [];
  }
}

export function addSubmission(data: Omit<Submission, "id" | "date" | "read" | "status" | "notes">): Submission {
  const submissions = getSubmissions();
  const newEntry: Submission = {
    ...data,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    read: false,
    status: "new",
    notes: "",
  };
  submissions.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  return newEntry;
}

export function markAsRead(id: string) {
  const submissions = getSubmissions();
  const updated = submissions.map((s) => (s.id === id ? { ...s, read: true } : s));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function markAllAsRead() {
  const submissions = getSubmissions().map((s) => ({ ...s, read: true }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export function updateStatus(id: string, status: SubmissionStatus) {
  const submissions = getSubmissions();
  const updated = submissions.map((s) => (s.id === id ? { ...s, status } : s));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateNotes(id: string, notes: string) {
  const submissions = getSubmissions();
  const updated = submissions.map((s) => (s.id === id ? { ...s, notes } : s));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteSubmission(id: string) {
  const submissions = getSubmissions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export function exportCSV(submissions: Submission[]) {
  const headers = ["Name", "Email", "Phone", "Message", "Date", "Status", "Read", "Notes"];
  const rows = submissions.map((s) => [
    `"${s.name}"`,
    `"${s.email}"`,
    `"${s.phone}"`,
    `"${s.message.replace(/"/g, '""')}"`,
    `"${new Date(s.date).toLocaleString()}"`,
    `"${s.status}"`,
    `"${s.read ? "Yes" : "No"}"`,
    `"${s.notes.replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
