import { Button, Row, Table, TableProps, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { path } from "../../routes/path";
import { useState, useEffect, useContext } from "react";
import { ProductType } from "../../services/api/type/product";
import { productApi } from "../../services/api/product";
import TableLoading from "../../components/loading/TableLoading";
import ActionMenu from "../../components/Actionmenu";
import { antdCtx } from "../../context";
import { MSG_DIST } from "../../utils/constants";

function Product() {
  const navigate = useNavigate();
  const { modalApi, notificationApi } = useContext(antdCtx);

  const [items, setItems] = useState<ProductType[]>();

  const columns: TableProps<ProductType>["columns"] = [
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
      dataIndex: ["category", "name"],
      title: "Danh mục",
    },
    {
      key: "price",
      dataIndex: "price",
      title: "Giá",
      render(_, record) {
        if (record.minPrice !== record.maxPrice) {
          return `${record.minPrice} - ${record.maxPrice}`;
        }
        return record.price;
      },
    },
    {
      key: "salePrice",
      dataIndex: "salePercent",
      title: "Khuyến mãi(%)",
    },
    {
      key: "action",
      title: "Hành động",
      render(_, record) {
        return (
          <ActionMenu
            actions={["view", "edit", "delete"]}
            onEdit={() => navigate(`${path.products}/${record.id}?action=edit`)}
            onView={() => navigate(`${path.products}/${record.id}?action=view`)}
            onDelete={() => handleDelete(record)}
          />
        );
      },
      width: 120,
      align: "center",
    },
  ];

  const handleDelete = (record: ProductType) => {
    modalApi?.error({
      title: "Xác nhận xóa sản phẩm",
      content: "Sản phẩm sẽ bị xóa và không thể khôi phục dữ liệu",
      okCancel: true,
      centered: true,
      okType: "danger",
      async onOk() {
        return productApi
          .delete(record.id)
          .then(() => {
            notificationApi?.success({
              message: "Thành công",
            });
            fetchData();
          })
          .catch((err: BaseResponse) => {
            notificationApi?.error({
              message: MSG_DIST[err.message] ?? "Thất bại",
            });
          });
      },
    });
  };

  const fetchData = () => {
    productApi
      .getAll()
      .then((res) => {
        setItems(res.data.products);
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
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Typography.Title level={3}>Danh sách sản phẩm</Typography.Title>
        <Button type="primary" onClick={() => navigate(`${path.products}/new`)}>
          Thêm mới
        </Button>
      </Row>
      <Table bordered columns={columns} dataSource={items} rowKey="id"></Table>
    </>
  );
}

export default Product;
