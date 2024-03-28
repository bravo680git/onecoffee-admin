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
    title: "Tên sản phẩm",
  },
  {
    key: "category",
    dataIndex: "categoryName",
    title: "Danh mục",
  },
  {
    key: "price",
    dataIndex: "price",
    title: "Giá gốc",
  },
  {
    key: "salePrice",
    dataIndex: "salePrice",
    title: "Giá khuyến mãi",
  },
];

function Product() {
  const navigate = useNavigate();

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Typography.Title level={3}>Danh sách sản phẩm</Typography.Title>
        <Button type="primary" onClick={() => navigate(`${path.products}/new`)}>
          Thêm mới
        </Button>
      </Row>
      <Table bordered columns={columns}></Table>
    </>
  );
}

export default Product;
