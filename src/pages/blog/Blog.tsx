import ActionMenu from "@/components/Actionmenu";
import TableLoading from "@/components/loading/TableLoading";
import { antdCtx } from "@/context";
import { blogApi } from "@/services/api/blog";
import { BlogType } from "@/services/api/type/blog";
import { Button, Row, Table, TableProps, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../../routes/path";

function Blog() {
  const navigate = useNavigate();
  const { modalApi, notificationApi } = useContext(antdCtx);

  const [items, setItems] = useState<BlogType[]>();

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
      // dataIndex: ["category", "name"],
      dataIndex: "categoryId",
      title: "Danh mục",
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Ngày tạo",
      render(value) {
        return new Date(value).toLocaleString("vi", {
          dateStyle: "short",
          timeStyle: "short",
        });
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
    },
    {
      key: "action",
      title: "Hành động",
      render(_, record) {
        return (
          <ActionMenu
            actions={["edit", "delete"]}
            onEdit={() => navigate(`${path.blogs}/${record.id}`)}
            onDelete={() => handleDelete(record.id)}
          />
        );
      },
      width: 120,
      align: "center",
    },
  ];

  const fetchData = () => {
    blogApi
      .getAll()
      .then((res) => {
        setItems(res.data.blogs);
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
      <Table bordered columns={columns} dataSource={items} rowKey="id"></Table>
    </>
  );
}

export default Blog;
