import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  TableProps,
  Typography,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { useState, useEffect, useContext } from "react";
import TableLoading from "../components/loading/TableLoading";
import { CategoryType } from "../services/api/type/category";
import { categoryApi } from "../services/api/category";
import ActionMenu from "../components/Actionmenu";
import { antdCtx } from "../context";
import { generateTreeData } from "../utils/functions";
import { MSG_DIST } from "../utils/constants";

function Category() {
  const { modalApi, notificationApi } = useContext(antdCtx);
  const [modalState, setModalState] = useState<ModalState<CategoryType>>({});
  const [data, setData] = useState<CategoryType[]>();
  const [loading, setLoading] = useState(false);

  const parentCategoryOptions = data
    ?.filter((item) => !item.parentId)
    .map((item) => ({ value: item.id, label: item.name }));
  const treeData = generateTreeData(data, (item) => item);

  const columns: TableProps<CategoryType>["columns"] = [
    {
      key: "name",
      dataIndex: "name",
      title: "Tiêu đề",
      onCell(data) {
        return { colSpan: data.parentId ? 1 : 2 };
      },
    },
    {
      key: "action",
      title: "Hành động",
      width: 120,
      align: "center",
      render(_, record) {
        return (
          record.parentId && (
            <ActionMenu
              actions={["edit", "delete"]}
              onDelete={() => handleDelete(record)}
              onEdit={() => setModalState({ open: true, data: record })}
            />
          )
        );
      },
      onCell(data) {
        return { colSpan: data.parentId ? 1 : 0 };
      },
    },
  ];

  const handleSubmit = async (data: CategoryType) => {
    setLoading(true);
    const api = modalState.data
      ? categoryApi.update(modalState.data.id, data)
      : categoryApi.create(data);
    api
      .then(() => {
        notificationApi?.success({
          message: "Thành công",
        });
        modalState.open = false;
        fetchData();
      })
      .catch((err: BaseResponse) => {
        notificationApi?.error({
          message: MSG_DIST[err.message] ?? "Thất bại",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchData = () => {
    categoryApi
      .getAll()
      .then((res) => {
        setData(res.data.categories);
      })
      .catch();
  };

  const handleDelete = (record: CategoryType) => {
    modalApi?.error({
      title: "Xác nhận xóa danh mục",
      content:
        "Danh mục sẽ bị xóa và sẽ gây ảnh hưởng đến các dữ liệu liên quan khác như sản phẩm, bài viết,...",
      okCancel: true,
      okType: "danger",
      centered: true,
      async onOk() {
        return categoryApi
          .delete(record.id)
          .then(() => {
            notificationApi?.success({
              message: "Xóa thành công",
            });
            fetchData();
          })
          .catch();
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return <TableLoading />;
  }

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Typography.Title level={3}>Danh mục</Typography.Title>
        <Button type="primary" onClick={() => setModalState({ open: true })}>
          Thêm mới
        </Button>
      </Row>
      <Table
        bordered
        columns={columns}
        dataSource={treeData}
        rowKey="id"
      ></Table>

      <Modal
        open={modalState.open}
        title="Danh mục"
        centered
        onCancel={() => setModalState({ open: false })}
        destroyOnClose
        okButtonProps={{ htmlType: "submit", loading, form: "form" }}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          id="form"
          initialValues={modalState.data}
        >
          <FormItem
            label="Danh mục cha"
            name="parentId"
            rules={[{ required: true, message: "Danh mục cha là bắt buộc" }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn danh mục cha"
              options={parentCategoryOptions}
            />
          </FormItem>
          <FormItem
            label="Tên danh mục"
            required
            rules={[{ required: true, message: "Tên danh mục là bắt buộc" }]}
            name="name"
          >
            <Input placeholder="Nhập tên danh mục" />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
}

export default Category;
