import BottomTabs from "@/components/BottomTabs";

export default function DashboardLayout({ children }) {
  return (
    <div className="mb-28">
      {children}
      <BottomTabs />
    </div>
  );
}
