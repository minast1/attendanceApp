import React from "react";
import { Outlet } from "remix";

const AdminRoute = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default AdminRoute;
