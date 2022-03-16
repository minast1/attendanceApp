import * as React from "react";
import { Outlet } from "remix";

const LecturerRouteLayout = () => {
  return (
    <div style={{ backgroundColor: "#eeeeee", height: "100vh" }}>
      <Outlet />
    </div>
  );
};

export default LecturerRouteLayout;
