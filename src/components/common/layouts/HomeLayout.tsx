import BottomNavbar from "./BottomNavBar";
import Header from "./Header";

interface HomeLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

function HomeLayout({ children, isLoading = false }: HomeLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header isLoading={isLoading} />
      <div className="flex-1 overflow-y-auto pb-[var(--bottom-nav-height)]">
        {children}
      </div>
      <BottomNavbar isLoading={isLoading} />
    </div>
  );
}

export default HomeLayout;
