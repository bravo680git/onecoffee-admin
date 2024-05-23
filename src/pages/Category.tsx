import { upload } from "@/services/api/upload";
import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Table,
  TableProps,
  TreeSelect,
  Typography,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { RcFile } from "antd/es/upload";
import { Key, useContext, useEffect, useState } from "react";
import ActionMenu from "../components/Actionmenu";
import TableLoading from "../components/loading/TableLoading";
import { antdCtx } from "../context";
import { categoryApi } from "../services/api/category";
import { CategoryType } from "../services/api/type/category";
import { CATEGORY_TYPE, MSG_DIST } from "../utils/constants";
import { generateTreeData } from "../utils/functions";

function Category() {
  const { modalApi, notificationApi } = useContext(antdCtx);
  const [modalState, setModalState] = useState<ModalState<CategoryType>>({});
  const [data, setData] = useState<CategoryType[]>();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState<RcFile>();
  const [expandKeys, setExpandKeys] = useState<readonly Key[]>([]);

  const treeData = generateTreeData(data, (item) => ({
    ...item,
    label: item.name,
    value: item.id,
  })).filter(
    (item) =>
      item.id === CATEGORY_TYPE.BLOG || item.id === CATEGORY_TYPE.PRODUCT
  );

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
    try {
      setLoading(true);
      const imageUrl = img
        ? (await upload(data.name, img)).data.image.url
        : data.image;
      const payload = { ...data, image: imageUrl };
      const api = modalState.data
        ? categoryApi.update(modalState.data.id, payload)
        : categoryApi.create(payload);
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
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = () => {
    categoryApi
      .getAll()
      .then((res) => {
        setData(res.data.categories);
        setExpandKeys(res.data.categories.map((i) => i.id));
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

  useEffect(() => {
    if (!modalState.open) {
      setImg(undefined);
    }
  }, [modalState]);

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
        expandable={{
          expandedRowKeys: expandKeys,
          onExpandedRowsChange: (keys) => setExpandKeys(keys),
        }}
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
            <TreeSelect
              style={{ width: "100%" }}
              placeholder="Chọn danh mục cha"
              treeData={treeData}
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

          {/* <Form.Item label="Hình ảnh" name="image">
            <ImgCrop aspect={3 / 4}>
              <Upload.Dragger
                onChange={({ file }) => {
                  setImg(file.originFileObj);
                }}
                multiple={false}
                maxCount={1}
                showUploadList={false}
                accept="image/*"
                style={{ position: "relative" }}
                action={FAKE_UPLOAD_URL}
              >
                {img ? (
                  <>
                    <img
                      src={URL.createObjectURL(img)}
                      alt=""
                      style={{
                        height: 140,
                        aspectRatio: "3/4",
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    />
                    <Button
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        zIndex: 10,
                      }}
                      danger
                      type="text"
                      icon={<Trash size={20} />}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImg(undefined);
                      }}
                    ></Button>
                  </>
                ) : (
                  <div>
                    <p className="ant-upload-drag-icon">
                      <Box />
                    </p>
                    <p className="ant-upload-text">
                      Chọn hoặc kéo thả hình ảnh
                    </p>
                    <p className="ant-upload-hint">
                      Chọn hình ảnh có tỉ lệ 3/4 nhằm đảm bảo hiển thị tốt nhất.
                    </p>
                  </div>
                )}
              </Upload.Dragger>
            </ImgCrop>
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
}

export default Category;
