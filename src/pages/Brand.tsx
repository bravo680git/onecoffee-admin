import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Table,
  TableProps,
  Typography,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { useContext, useEffect, useState } from "react";
import ActionMenu from "../components/Actionmenu";
import TableLoading from "../components/loading/TableLoading";
import { antdCtx } from "../context";
import { brandApi } from "../services/api/brand";
import { BrandType } from "../services/api/type/brand";
import { MSG_DIST } from "../utils/constants";

function Brand() {
  const { modalApi, notificationApi } = useContext(antdCtx);
  const [modalState, setModalState] = useState<ModalState<BrandType>>({});
  const [data, setData] = useState<BrandType[]>();
  const [loading, setLoading] = useState(false);

  const columns: TableProps<BrandType>["columns"] = [
    {
      key: "index",
      title: "No.",
      render(_, __, index) {
        return index + 1;
      },
      width: 80,
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Tên thương hiệu",
    },
    {
      key: "action",
      title: "Hành động",
      width: 120,
      align: "center",
      render(_, record) {
        return (
          <ActionMenu
            actions={["edit", "delete"]}
            onDelete={() => handleDelete(record)}
            onEdit={() => setModalState({ open: true, data: record })}
          />
        );
      },
    },
  ];

  const handleSubmit = async (data: BrandType) => {
    setLoading(true);
    const api = modalState.data
      ? brandApi.update(modalState.data.id, data)
      : brandApi.create(data);
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
    brandApi
      .getAll()
      .then((res) => {
        setData(res.data);
      })
      .catch();
  };

  const handleDelete = (record: BrandType) => {
    modalApi?.error({
      title: "Xác nhận xóa thương hiệu này",
      content:
        "Thương hiệu sẽ bị xóa và sẽ gây ảnh hưởng đến các sản phẩm liên quan",
      okCancel: true,
      okType: "danger",
      centered: true,
      async onOk() {
        return brandApi
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
        <Typography.Title level={3}>Thương hiệu</Typography.Title>
        <Button type="primary" onClick={() => setModalState({ open: true })}>
          Thêm mới
        </Button>
      </Row>
      <Table bordered columns={columns} dataSource={data} rowKey="id"></Table>

      <Modal
        open={modalState.open}
        title="Thương hiệu"
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
            label="Tên thương hiệu"
            required
            rules={[{ required: true, message: "Tên thương hiệu là bắt buộc" }]}
            name="name"
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
}

export default Brand;
