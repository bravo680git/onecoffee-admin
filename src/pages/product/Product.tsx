import {
  Button,
  Checkbox,
  Col,
  Input,
  Row,
  Select,
  SelectProps,
  Space,
  Switch,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionMenu from "../../components/Actionmenu";
import TableLoading from "../../components/loading/TableLoading";
import { antdCtx } from "../../context";
import { path } from "../../routes/path";
import { productApi } from "../../services/api/product";
import { ProductType } from "../../services/api/type/product";
import { CATEGORY_TYPE, MSG_DIST } from "../../utils/constants";
import { SearchNormal } from "iconsax-react";
import { stringTest } from "@/utils/functions";
import { categoryApi } from "@/services/api/category";

function Product() {
  const navigate = useNavigate();
  const { modalApi, notificationApi } = useContext(antdCtx);

  const [items, setItems] = useState<ProductType[]>();
  const [catOpts, setCatOpts] = useState<SelectProps["options"]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<number>();
  const [pin, setPin] = useState(false);

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
      filtered: true,
    },
    {
      key: "category",
      dataIndex: ["category", "name"],
      title: "Danh mục",
      sorter(a, b) {
        return a.category > b.category ? 1 : -1;
      },
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
      sorter(a, b) {
        return a.minPrice - b.minPrice;
      },
    },
    {
      key: "salePrice",
      dataIndex: "salePercent",
      title: "Khuyến mãi(%)",
      sorter(a, b) {
        return a.salePercent - b.salePercent;
      },
    },
    {
      key: "pin",
      dataIndex: "pin",
      title: "Pin",
      render(value: boolean) {
        return <Checkbox checked={value} />;
      },
      align: "center",
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

  const filteredItems = useMemo(() => {
    return items?.filter((item) => {
      return (
        (!category || category === item.categoryId) &&
        stringTest(item.name, searchInput) &&
        (!pin || item.pin)
      );
    });
  }, [items, searchInput, category, pin]);

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
        setItems(res.data);
      })
      .catch();
  };

  useEffect(() => {
    fetchData();
    categoryApi
      .getAll()
      .then((res) => {
        setCatOpts(
          res.data
            ?.filter((item) => item.parentId === CATEGORY_TYPE.PRODUCT)
            ?.map((item) => ({
              label: item.name,
              value: item.id,
            }))
        );
      })
      .catch();
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
      <Table
        bordered
        columns={columns}
        dataSource={filteredItems}
        rowKey="id"
        title={() => (
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Input
                prefix={<SearchNormal size={20} />}
                placeholder="Tìm kiếm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Col>
            <Col>
              <Select
                style={{ width: 160 }}
                placeholder={"Danh mục"}
                options={catOpts}
                value={category}
                onChange={setCategory}
                allowClear
              />
            </Col>
            <Col>
              <Space>
                <Switch value={pin} onChange={setPin} />
                <span>Pin</span>
              </Space>
            </Col>
          </Row>
        )}
      ></Table>
    </>
  );
}

export default Product;
