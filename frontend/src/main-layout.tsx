import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export const MainLayout = () => {
  return (
    <div className="color-white">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
