import { Button, Card, Dropdown } from "antd";
import { Action } from "../utils/constants";
import { Additem, Edit, Eye, More, Trash } from "iconsax-react";
import React from "react";

export type ActionMenuProps = {
  actions: (keyof typeof Action)[];
  onCreate?(): void;
  onEdit?(): void;
  onView?(): void;
  onDelete?(): void;
};

type ActionDist = Record<
  keyof typeof Action,
  {
    title: string;
    icon: React.ReactNode;
    onClick?(): void;
    danger?: boolean;
  }
>;

function ActionMenu({
  actions,
  onCreate,
  onDelete,
  onEdit,
  onView,
}: ActionMenuProps) {
  const actionDist: ActionDist = {
    create: {
      title: "Tạo mới",
      icon: <Additem size={16} />,
      onClick: onCreate,
    },
    edit: {
      title: "Sửa",
      icon: <Edit size={16} />,
      onClick: onEdit,
    },
    view: {
      title: "Xem",
      icon: <Eye size={16} />,
      onClick: onView,
    },
    delete: {
      title: "Xóa",
      icon: <Trash size={16} />,
      onClick: onDelete,
      danger: true,
    },
  };

  return (
    <Dropdown
      trigger={["click"]}
      dropdownRender={() => (
        <Card
          styles={{
            body: { padding: 8, display: "flex", flexDirection: "column" },
          }}
        >
          {actions.map((act) => (
            <Button
              key={act}
              onClick={actionDist[act].onClick}
              icon={actionDist[act].icon}
              type="text"
              style={{
                textAlign: "left",
                display: "flex",
                justifyContent: "flex-start",
                gap: 0,
                alignItems: "center",
              }}
              danger={actionDist[act].danger}
            >
              {actionDist[act].title}
            </Button>
          ))}
        </Card>
      )}
    >
      <Button icon={<More size={20} />}></Button>
    </Dropdown>
  );
}

export default ActionMenu;
