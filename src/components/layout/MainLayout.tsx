
import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
