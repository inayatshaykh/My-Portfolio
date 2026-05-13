export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

const STORAGE_KEY = "contact_submissions";

export function getSubmissions(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addSubmission(data: Omit<Submission, "id" | "date" | "read">): Submission {
  const submissions = getSubmissions();
  const newEntry: Submission = {
    ...data,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    read: false,
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

export function deleteSubmission(id: string) {
  const submissions = getSubmissions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}
