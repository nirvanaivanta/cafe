import AdminSidebar from "@/components/AdminSidebar";
import RekapPage from "./RekapAdmin";

export default function HomePage() {
   return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-0 sm:ml-64 w-full">
        <RekapPage />
      </main>
    </div>
  );
}