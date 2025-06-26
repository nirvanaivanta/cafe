import AdminSidebar from "@/components/AdminSidebar";
import MenuAdmin from "./MenuAdmin";


export default function HomePage() {
   return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-0 sm:ml-64 w-full">
        <MenuAdmin />
      </main>
    </div>
  );
}