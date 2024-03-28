import { Table, TableProps, Typography } from "antd";

const columns: TableProps["columns"] = [
  {
    title: "No.",
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
  return (
    <div>
      <Typography.Title level={3}>
        Quản lý thông tin khách hàng
      </Typography.Title>
      <Table columns={columns} dataSource={[]} bordered />
    </div>
  );
}

export default User;
