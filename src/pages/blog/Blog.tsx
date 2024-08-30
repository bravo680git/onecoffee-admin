import ActionMenu from "@/components/Actionmenu";
import TableLoading from "@/components/loading/TableLoading";
import { antdCtx } from "@/context";
import { blogApi } from "@/services/api/blog";
import { BlogType } from "@/services/api/type/blog";
import { Action, CATEGORY_TYPE } from "@/utils/constants";
import {
  Button,
  Col,
  Input,
  Row,
  Select,
  SelectProps,
  Table,
  TableProps,
  Typography,
} from "antd";
import { SearchNormal } from "iconsax-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../../routes/path";
import { stringTest } from "@/utils/functions";
import { categoryApi } from "@/services/api/category";

function Blog() {
  const navigate = useNavigate();
  const { modalApi, notificationApi } = useContext(antdCtx);

  const [items, setItems] = useState<BlogType[]>();
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<number>();
  const [catOpts, setCatOpts] = useState<SelectProps["options"]>([]);

  const columns: TableProps<BlogType>["columns"] = [
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
      dataIndex: "title",
      title: "Tiêu đề",
    },
    {
      key: "category",
      dataIndex: ["category", "name"],
      // dataIndex: "categoryId",
      title: "Danh mục",
      sorter(a, b) {
        return a.categoryId - b.categoryId;
      },
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Ngày tạo",
      render(value) {
        return value
          ? new Date(value).toLocaleString("vi", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "";
      },
      sorter(a, b) {
        return (a.createdAt ?? "") > (b.createdAt ?? "") ? 1 : -1;
      },
    },
    {
      key: "lastVerify",
      dataIndex: "updatedAt",
      title: "Cập nhật",
      render(value) {
        return new Date(value).toLocaleString("vi", {
          dateStyle: "short",
          timeStyle: "short",
        });
      },
      sorter(a, b) {
        return (a.updatedAt ?? "") > (b.updatedAt ?? "") ? 1 : -1;
      },
    },
    {
      key: "action",
      title: "Hành động",
      render(_, record) {
        const actions: (keyof typeof Action)[] = ["edit"];
        if (record.createdAt) {
          actions.push("delete");
        }
        return (
          <ActionMenu
            actions={actions}
            onEdit={() => navigate(`${path.blogs}/${record.id}`)}
            onDelete={() => handleDelete(record.id)}
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
        stringTest(item.title, searchInput)
      );
    });
  }, [items, category, searchInput]);

  const fetchData = () => {
    blogApi
      .getAll()
      .then((res) => {
        setItems(res.data);
      })
      .catch();
  };

  const handleDelete = (id: number) => {
    modalApi?.error({
      title: "Xác nhận xóa bài viết",
      content: "Bài viết sẽ bị xóa và không thể khôi phục",
      okCancel: true,
      centered: true,
      okType: "danger",
      async onOk() {
        await blogApi
          .delete(id)
          .then(() => {
            notificationApi?.success({
              message: "Thành công",
            });
            fetchData();
          })
          .catch((err: BaseResponse) => {
            notificationApi?.error({
              message: err.message,
            });
          });
      },
    });
  };

  useEffect(() => {
    fetchData();
    categoryApi.getAll().then((res) => {
      setCatOpts(
        res.data
          .filter((item) => item.parentId === CATEGORY_TYPE.BLOG)
          .map((item) => ({
            label: item.name,
            value: item.id,
          }))
      );
    });
  }, []);

  if (!items) {
    return <TableLoading />;
  }

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Typography.Title level={3}>Quản lý bài viết</Typography.Title>
        <Button type="primary" onClick={() => navigate(`${path.blogs}/new`)}>
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
                style={{ minWidth: 240 }}
                placeholder={"Danh mục"}
                options={catOpts}
                value={category}
                onChange={setCategory}
                allowClear
              />
            </Col>
          </Row>
        )}
      ></Table>
    </>
  );
}

export default Blog;
