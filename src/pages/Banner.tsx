import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Table,
  TableProps,
  Typography,
  Upload,
} from "antd";
import ActionMenu from "../components/Actionmenu";
import { Box, Trash } from "iconsax-react";
import { RcFile } from "antd/es/upload";
import { useContext, useEffect, useState } from "react";
import ImgCrop from "antd-img-crop";
import { BannerType } from "../services/api/type/banner";
import { FAKE_UPLOAD_URL, MSG_DIST, RULES } from "../utils/constants";
import { upload } from "../services/api/upload";
import { bannerApi } from "../services/api/banner";
import { antdCtx } from "../context";
import TableLoading from "../components/loading/TableLoading";
import { Link } from "react-router-dom";

type BannerFormData = Omit<BannerType, "image"> & {
  image: RcFile;
};

function Banner() {
  const [form] = Form.useForm();
  const { notificationApi, modalApi } = useContext(antdCtx);

  const [modalState, setModalState] = useState<ModalState<BannerType>>();
  const [imgSrc, setImgSrc] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BannerType[]>();

  const columns: TableProps<BannerType>["columns"] = [
    {
      key: "index",
      title: "No.",
      render(_, __, i) {
        return i + 1;
      },
      width: 60,
    },
    {
      key: "name",
      title: "Tên",
      dataIndex: "name",
    },
    {
      key: "active",
      title: "Có hiệu lực",
      dataIndex: "isActive",
      align: "center",
      render(value) {
        return <Checkbox checked={value} />;
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render(v) {
        return <Image src={v} width={160} />;
      },
      align: "center",
      width: 180,
    },
    {
      title: "URL",
      dataIndex: "link",
      render(v) {
        return <Link to={v}>{v}</Link>;
      },
    },
    {
      title: "Hành động",
      render(_, record) {
        return (
          <ActionMenu
            actions={["edit", "delete"]}
            onDelete={() => handleDelete(record)}
            onEdit={() => {
              setModalState({ open: true, data: record });
              setImgSrc(record.image);
            }}
          />
        );
      },
      width: 120,
      align: "center",
    },
  ];

  const handleSubmit = async (data: BannerFormData) => {
    setLoading(true);

    try {
      const imgUrl =
        data.image instanceof File
          ? (await upload(data.name, data.image)).data.image.url
          : data.image;
      const api = modalState?.data
        ? bannerApi.update(modalState.data.id, { ...data, image: imgUrl })
        : bannerApi.create({
            ...data,
            image: imgUrl,
            isActive: data.isActive ?? true,
          });
      await api;
      notificationApi?.success({
        message: "Thành công",
      });
      setModalState({});
      form.resetFields();
      fetchData();
    } catch (err) {
      notificationApi?.error({
        message: MSG_DIST[(err as BaseResponse).message] ?? "Thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    bannerApi
      .getAll()
      .then((res) => {
        setItems(res.data.banners);
      })
      .catch();
  };

  const handleDelete = (item: BannerType) => {
    modalApi?.error({
      title: "Xác nhận xóa banner",
      okType: "danger",
      okCancel: true,
      centered: true,
      async onOk() {
        return bannerApi
          .delete(item.id)
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

  useEffect(() => {
    if (!modalState?.open) {
      setImgSrc(undefined);
    }
  }, [modalState?.open]);

  useEffect(() => {
    fetchData();
  }, []);

  if (!items) {
    return <TableLoading />;
  }

  return (
    <div>
      <Row align="middle" justify="space-between">
        <Typography.Title level={3}> Quản lý banner </Typography.Title>
        <Button type="primary" onClick={() => setModalState({ open: true })}>
          Tạo mới
        </Button>
      </Row>
      <Table columns={columns} dataSource={items} rowKey="id" bordered />

      <Modal
        centered
        title={"Thêm banner"}
        open={modalState?.open}
        destroyOnClose
        okButtonProps={{ form: "form", htmlType: "submit", loading }}
        onCancel={() => {
          setModalState({});
          form.resetFields();
        }}
      >
        <Form
          layout="vertical"
          id="form"
          form={form}
          onFinish={handleSubmit}
          initialValues={modalState?.data}
          preserve={false}
        >
          <Form.Item<BannerFormData>
            label="Tên"
            name="name"
            rules={[RULES.REQUIRED]}
          >
            <Input placeholder="Nhập tên banner" />
          </Form.Item>

          <Form.Item<BannerFormData>
            label="URL"
            name="link"
            rules={[RULES.REQUIRED]}
          >
            <Input placeholder="Nhập URL trang chuyển đến khi nhấn vào banner" />
          </Form.Item>

          <Form.Item<BannerFormData> label="Mô tả" name="caption">
            <Input.TextArea
              style={{ resize: "none" }}
              rows={2}
              placeholder="Nhập mô tả(tùy chọn)"
            />
          </Form.Item>

          <Form.Item<BannerFormData>
            label="Hình ảnh"
            rules={[RULES.REQUIRED]}
            name="image"
          >
            <ImgCrop aspect={4}>
              <Upload.Dragger
                onChange={({ file }) => {
                  setImgSrc(URL.createObjectURL(file.originFileObj as RcFile));
                  form.setFieldValue("image", file.originFileObj);
                  form.validateFields();
                }}
                multiple={false}
                action={FAKE_UPLOAD_URL}
                maxCount={1}
                showUploadList={false}
                accept="image/*"
                style={{ position: "relative" }}
              >
                {imgSrc ? (
                  <>
                    <img
                      src={imgSrc}
                      alt=""
                      style={{
                        width: "100%",
                        aspectRatio: "4/1",
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
                        setImgSrc(undefined);
                        form.setFieldValue("image", undefined);
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
                      Chọn hình ảnh có tỉ lệ 4/1 nhằm đảm bảo hiển thị tốt nhất.
                    </p>
                  </div>
                )}
              </Upload.Dragger>
            </ImgCrop>
          </Form.Item>

          <Form.Item<BannerType>
            name="isActive"
            noStyle
            valuePropName="checked"
          >
            <Checkbox defaultChecked>Có hiệu lực</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Banner;
