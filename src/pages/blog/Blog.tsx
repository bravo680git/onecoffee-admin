import { Button, Row, Table, TableProps, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { path } from "../../routes/path";

const columns: TableProps["columns"] = [
  {
    key: "index",
    title: "No.",
    render(_, __, index) {
      return index + 1;
    },
    width: 60,
  },
  {
    key: "name",
    dataIndex: "name",
    title: "Tiêu đề",
  },
  {
    key: "category",
    dataIndex: "categoryId",
    title: "Danh mục",
  },
  {
    key: "lastVerify",
    dataIndex: "updatedAt",
    title: "Cập nhật",
  },
];

function Blog() {
  const navigate = useNavigate();

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Typography.Title level={3}>Quản lý bài viết</Typography.Title>
        <Button type="primary" onClick={() => navigate(`${path.blogs}/new`)}>
          Thêm mới
        </Button>
      </Row>
      <Table bordered columns={columns}></Table>
    </>
  );
}

export default Blog;
