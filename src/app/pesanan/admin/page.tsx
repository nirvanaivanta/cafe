import AdminSidebar from "@/components/AdminSidebar";
import PesananPage from "./PesananAdmin";

export default function HomePage() {
   return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-0 sm:ml-64 w-full">
        <PesananPage />
      </main>
    </div>
  );
}