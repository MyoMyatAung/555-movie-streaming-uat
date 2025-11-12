import BottomNavbar from "./BottomNavBar";
import Header from "./Header";

interface HomeLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  /**
   * Optional custom header component to replace the default Header.
   * If provided, the default Header will not be rendered.
   */
  customHeader?: React.ReactNode;
  /**
   * If true, no header will be rendered (useful if you want to include header in children).
   * Default is false.
   */
  noHeader?: boolean;
}

function HomeLayout({
  children,
  isLoading = false,
  customHeader,
  noHeader = false,
}: HomeLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {!noHeader && (customHeader || <Header isLoading={isLoading} />)}
      <div className="flex-1 overflow-y-auto pb-[calc(var(--bottom-nav-height))]">
        {children}
      </div>
      <BottomNavbar isLoading={isLoading} />
    </div>
  );
}

export default HomeLayout;
