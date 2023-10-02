import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="layoutContainer">
      <div className="wrap">
        <div className="top-plane"></div>
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
