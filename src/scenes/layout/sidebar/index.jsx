import React, { useEffect, useState, useContext, useMemo } from "react";
import { Avatar, Box, IconButton, Typography, useTheme, Skeleton } from "@mui/material";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  DashboardOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  DirectionsCar,
  PersonOutline,
  InfoOutlined,
  CategoryOutlined,
  AssignmentTurnedInOutlined,
  PaymentOutlined,
} from "@mui/icons-material";
import logo from "../../../assets/images/nom.png";
import chayma from "../../../assets/images/imagechayma.jpeg";
import { ToggledContext } from "../../../App";
import Item from "./Item";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserName(userData.name);
      setUserRole(userData.role || "Utilisateur");

      const userId = userData.id;
      if (userId) {
        fetch(`/api/user/image/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.imageUrl) {
              setUserImage(data.imageUrl);
            }
          })
          .catch((error) => console.error("Error fetching user image:", error));
      }
    }
  }, []);

  const menuItemStyles = useMemo(
    () => ({
      button: {
        ":hover": { color: "#868dfb", background: "rgba(134, 141, 251, 0.1)", transition: ".4s ease" },
        fontSize: "1rem",
        padding: "10px 20px",
      },
    }),
    []
  );

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
        width: collapsed ? "80px" : "300px",
        transition: "width 0.3s ease",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu menuItemStyles={{ button: { ":hover": { background: "transparent" } } }}>
        <MenuItem rootStyles={{ margin: "40px 0 50px 0", color: colors.gray[100] }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {!collapsed && (
              <Box display="flex" alignItems="center" gap="5px">
                <img style={{ width: "180px", height: "auto" }} src={logo} alt="Logo" />
              </Box>
            )}
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Ouvrir la barre latérale" : "Fermer la barre latérale"}
            >
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {!collapsed && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", mb: "20px" }}>
          {userImage || userRole ? (
            <Avatar
              alt="avatar"
              src={userRole?.toLowerCase() === "admin" ? chayma : userImage}
              sx={{ width: "100px", height: "100px", border: `2px solid ${colors.primary[500]}` }}
            />
          ) : (
            <Skeleton variant="circular" width={100} height={100} />
          )}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#302855">
              {userRole || <Skeleton width={80} />}
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="#5271ff">
              {userName || <Skeleton width={120} />}
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={3} pl={collapsed ? undefined : "5%"}>
        <Menu menuItemStyles={menuItemStyles}>
          <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
          <MenuItem
            onClick={() => setOpenInfo(!openInfo)}
            style={{ color: colors.gray[100], fontSize: "0.9rem" }}
            icon={<InfoOutlined />}
          >
            Information
          </MenuItem>
          {openInfo && (
            <>
              <Item title="Client" path="/client" colors={colors} icon={<PeopleAltOutlined />} style={{ fontSize: "0.8rem" }} />
              <Item title="Vehicules" path="/Vehicules" colors={colors} icon={<DirectionsCar />} style={{ fontSize: "0.8rem" }} />
              <Item title="Categorie" path="/Categorie" colors={colors} icon={<CategoryOutlined />} style={{ fontSize: "0.8rem" }} />
              <Item title="Contrat" path="/contrat" colors={colors} icon={<AssignmentTurnedInOutlined />} style={{ fontSize: "0.8rem" }} />
              <Item title="Avance" path="/avance" colors={colors} icon={<PaymentOutlined />} style={{ fontSize: "0.8rem" }} />
            </>
          )}
          <Item title="Utilisateur" path="/Utilisateur" colors={colors} icon={<PersonOutline />} />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;