import TableLoading from "@/components/loading/TableLoading";
import { UserType } from "@/services/api/type/user";
import { userApi } from "@/services/api/user";
import { Table, TableProps, Typography } from "antd";
import { useState, useEffect } from "react";

const columns: TableProps["columns"] = [
  {
    title: "No.",
    render(_, __, i) {
      return i + 1;
    },
    width: 60,
  },
  {
    title: "Họ và tên",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

function User() {
  const [items, setItems] = useState<UserType[]>();

  const fetchData = () => {
    userApi
      .getAll()
      .then((res) => {
        setItems(res.data.data);
      })
      .catch();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!items) {
    return <TableLoading />;
  }
  return (
    <div>
      <Typography.Title level={3}>
        Quản lý thông tin khách hàng
      </Typography.Title>
      <Table columns={columns} dataSource={items} bordered rowKey="id" />
    </div>
  );
}

export default User;
