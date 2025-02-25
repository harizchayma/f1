import { MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

const Item = ({ title, path, icon }) => {
  const location = useLocation();
  return (
    <MenuItem
      component={<Link to={path} />}
      to={path}
      icon={<span style={{ fontSize: "20px" }}>{icon}</span>} // Adjusted icon size
      rootStyles={{
        color: path === location.pathname && "#5271ff",
        padding: "8px 16px", // Adjusted padding
      }}
    >
      {title}
    </MenuItem>
  );
};

export default Item;