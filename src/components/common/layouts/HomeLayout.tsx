import BottomNavbar from "./BottomNavBar";
import Header from "./Header";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto pb-[var(--bottom-nav-height)]">
        {children}
      </div>
      <BottomNavbar />
    </div>
  );
}

export default HomeLayout;
