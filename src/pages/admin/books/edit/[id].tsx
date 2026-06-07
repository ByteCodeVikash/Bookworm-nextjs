// src/pages/admin/books/edit/[id].tsx
import { BookFormPage } from "@/admin/pages/BookFormPage";

export default function AdminEditBookPageWrapper() {
  return <BookFormPage isEdit={true} />;
}
