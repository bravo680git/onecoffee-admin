import {
  Avatar,
  Button,
  DropDownProps,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  theme,
} from "antd";
import React from "react";
import { path } from "../../routes/path";
import { border } from "../../theme/constants";
import { Home, Category2, ArrowLeft2, LogoutCurve } from "iconsax-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems: MenuProps["items"] = [
  {
    key: path.home,
    label: "Trang chủ",
    icon: <Home size={16} />,
  },
  {
    key: path.categories,
    label: "Danh mục",
    icon: <Category2 size={16} />,
  },
];

const userMenu: DropDownProps["menu"] = {
  items: [
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutCurve size={16} />,
    },
  ],
};

function MainLayout({ children }: { children: React.ReactNode }) {
  const { colorBgBase } = theme.useToken().token;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const handleNavigate: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        width={240}
        style={{
          borderRight: border,
          backgroundColor: colorBgBase,
          position: "relative",
        }}
        collapsible
        collapsedWidth={80}
        trigger={null}
        collapsed={!open}
      >
        <div style={{ padding: 16, paddingTop: 32, display: "flex" }}>
          <img src="/logo.png" alt="" style={{ maxWidth: "100%" }} />
        </div>
        <Menu
          items={menuItems}
          style={{ marginTop: 20 }}
          onClick={handleNavigate}
          selectedKeys={[path]}
        ></Menu>
        <Button
          style={{ position: "absolute", bottom: 16, width: "100%" }}
          onClick={() => setOpen(!open)}
          type="text"
        >
          <ArrowLeft2
            size={20}
            style={{
              transform: !open ? "rotateY(180deg)" : undefined,
              transition: "all 0.3s",
            }}
          />
        </Button>
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            backgroundColor: colorBgBase,
            borderBottom: border,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Dropdown menu={userMenu} trigger={["click"]}>
            <Avatar
              style={{ marginLeft: "auto", cursor: "pointer" }}
              size={48}
            />
          </Dropdown>
        </Layout.Header>
        <Layout.Content style={{ padding: 16, height: "calc(100vh - 65px)" }}>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
