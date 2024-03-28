import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TableProps,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import { RcFile } from "antd/es/upload";
import { Add, ArrowLeft, ArrowRight, Trash } from "iconsax-react";
import { KeyboardEvent, useRef, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PRODUCT_EDITOR_OPTION } from "../../utils/constants";
import { combineArrays } from "../../utils/functions";
import ProductFormLoading from "../../components/loading/ProductFormLoading";

type ProductForm = {
  name: string;
  categoryId: number;
  unitId: number;
  hasMultiOptions: boolean;
  price: number;
  salePercent: number;
  quantity: number;
  variants: {
    type: string;
    values: string[];
  }[];
  images: RcFile[];
  variantValues: Record<string | number, string | number>[];
};

type VariantValuesTableData = {
  columns: TableProps["columns"];
  body: Array<Record<string | number, string | number>>;
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function ProductDetail() {
  const { id } = useParams();
  const [form] = Form.useForm<ProductForm>();
  const isCreateMode = id === "new";

  const hasMultiOptions = Form.useWatch<boolean>(["hasMultiOptions"], form);
  const variants = Form.useWatch<ProductForm["variants"] | undefined>(
    ["variants"],
    form
  );
  const variantValuesTableData = useRef<VariantValuesTableData>({
    columns: [],
    body: [],
  });

  const [variantInputs, setVariantInputs] = useState<Record<number, string>>(
    {}
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [editingVariants, setEditingVariants] = useState(true);

  const canShowVariantValuesTable = useMemo(() => {
    return !variants?.some((item) => !item?.type || !item?.values?.length);
  }, [variants]);

  const handleEnterVariantValue = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const targetValue = (e.target as HTMLInputElement).value;
    if (e.key !== "Enter" || !targetValue) return;
    e.preventDefault();
    const prevValue: string[] =
      form.getFieldValue(["variants", index, "values"]) ?? [];

    if (prevValue.includes(targetValue)) return;

    form.setFieldValue(
      ["variants", index, "values"],
      [...prevValue, targetValue]
    );
    setVariantInputs({ ...variantInputs, [index]: "" });
  };

  const removeVariantValue = (index: number, v: string) => {
    const prevValue = variants?.[index]?.values ?? [];
    form.setFieldValue(
      ["variants", index, "values"],
      prevValue.filter((item) => item !== v)
    );
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const getVariantValuesWhenUpdatePrice = (
    data: VariantValuesTableData,
    index: number,
    key: "price" | "salePercent" | "quantity",
    value: number
  ): VariantValuesTableData => {
    const newData: VariantValuesTableData = {
      ...data,
      body: [...data.body],
    };
    newData.body[index][key] = value;

    return newData;
  };

  const handleShowVariantValuesTable = () => {
    const tableData: VariantValuesTableData = {
      columns: [],
      body: [],
    };

    variants?.forEach((item, index) => {
      tableData.columns?.push({
        title: item?.type,
        key: item?.type,
        dataIndex: index,
      });
    });
    const combineArr = combineArrays(
      variants?.map((item) => item?.values ?? []) ?? []
    );
    combineArr.forEach((item, index) => {
      tableData.body.push({
        key: index,
        price: "",
        salePercent: "",
        quantity: "",
        ...item.reduce((acc, crr, i) => {
          acc[i] = crr;
          return acc;
        }, {} as VariantValuesTableData["body"][number]),
      });
    });

    tableData.columns?.push(
      {
        key: "price",
        dataIndex: "price",
        title: "Giá gốc(đ)",
        render(_, __, index) {
          return (
            <InputNumber
              style={{ width: "100%" }}
              placeholder="12000đ"
              onBlur={(v) => {
                const vdata = getVariantValuesWhenUpdatePrice(
                  variantValuesTableData.current,
                  index,
                  "price",
                  Number(v.target.value)
                );
                variantValuesTableData.current = vdata;
              }}
            />
          );
        },
      },
      {
        key: "salePercent",
        dataIndex: "salePercent",
        title: "Khuyến mãi(%)",
        render(__, _, index) {
          return (
            <InputNumber
              style={{ width: "100%" }}
              placeholder="33.33%"
              onBlur={(v) => {
                const vdata = getVariantValuesWhenUpdatePrice(
                  variantValuesTableData.current,
                  index,
                  "salePercent",
                  Number(v.target.value)
                );
                variantValuesTableData.current = vdata;
              }}
            />
          );
        },
      },
      {
        key: "quantity",
        dataIndex: "quantity",
        title: "Số lượng",
        render(__, _, index) {
          return (
            <InputNumber
              style={{ width: "100%" }}
              placeholder="24"
              onBlur={(v) => {
                const vdata = getVariantValuesWhenUpdatePrice(
                  variantValuesTableData.current,
                  index,
                  "quantity",
                  Number(v.target.value)
                );
                variantValuesTableData.current = vdata;
              }}
            />
          );
        },
      }
    );

    variantValuesTableData.current = tableData;
    setEditingVariants(false);
  };

  const backupFormData = () => {
    const data = form.getFieldsValue() as ProductForm;

    const pVariants = form.getFieldValue("variants") ?? variants;
    if (pVariants) {
      data.variants = pVariants;
    }
    data.variantValues = variantValuesTableData.current.body;
    localStorage.setItem("product-form", JSON.stringify(data));
  };

  const handleSubmit = (data: ProductForm) => {
    console.log(data);
  };

  useEffect(() => {
    setInterval(() => {
      backupFormData();
    }, 10000000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ProductFormLoading />;

  return (
    <div>
      <Typography.Title level={3}>
        {isCreateMode ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"}
      </Typography.Title>

      <Form<ProductForm> layout="vertical" form={form} onFinish={handleSubmit}>
        <Typography.Title level={5}>Thông tin sản phẩm</Typography.Title>
        <Row gutter={[16, 16]}>
          <Col span={24} md={12} xl={8}>
            <Form.Item<ProductForm> label="Tên sản phẩm">
              <Input placeholder="Áo thun nam LV" />
            </Form.Item>
          </Col>
          <Col span={24} md={12} xl={8}>
            <Form.Item<ProductForm> label="Danh mục">
              <Input placeholder="Thời trang" />
            </Form.Item>
          </Col>
          <Col span={24} md={12} xl={4}>
            <Form.Item<ProductForm> label="Đơn vị">
              <Select style={{ width: "100%" }} placeholder="Cái" />
            </Form.Item>
          </Col>
          <Col span={24} md={12} xl={4}>
            <Form.Item<ProductForm>
              label="Loại sản phẩm"
              name="hasMultiOptions"
              valuePropName="checked"
            >
              <Checkbox>Có nhiều phân loại</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        {!hasMultiOptions ? (
          <Row gutter={[16, 16]}>
            <Col span={24} md={8}>
              <Form.Item<ProductForm> label="Giá gốc">
                <InputNumber style={{ width: "100%" }} placeholder="167000đ" />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item<ProductForm> label="Khuyến mãi">
                <InputNumber style={{ width: "100%" }} placeholder="33.33%" />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item<ProductForm> label="Số lượng sản phẩm">
                <InputNumber style={{ width: "100%" }} placeholder="24" />
              </Form.Item>
            </Col>
          </Row>
        ) : editingVariants ? (
          <Form.List
            name="variants"
            initialValue={[{ type: "", variants: [] }]}
          >
            {(fileds, { add, remove }) => (
              <Row gutter={[16, 16]} align="top" style={{ marginBottom: 16 }}>
                {fileds.map((field) => (
                  <Col key={field.key} span={24} md={12} xl={8}>
                    <Card
                      styles={{
                        body: { padding: 16 },
                      }}
                      title={`# Phân loại ${field.name + 1}`}
                      extra={
                        <Button
                          danger
                          icon={<Trash size={20} />}
                          onClick={() => remove(field.name)}
                          disabled={!variants || variants.length < 2}
                        ></Button>
                      }
                    >
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Form.Item<ProductForm["variants"]>
                            label="Loại tùy chọn"
                            name={[field.name, "type"]}
                            rules={[{ max: 30 }]}
                          >
                            <Input placeholder="Kích thước" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Typography.Text>Giá trị</Typography.Text>
                          <Input
                            placeholder="15x34"
                            style={{ marginTop: 8 }}
                            onKeyDown={(e) =>
                              handleEnterVariantValue(e, field.name)
                            }
                            value={variantInputs[field.name]}
                            onChange={(e) =>
                              setVariantInputs({
                                ...variantInputs,
                                [field.name]: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </Row>
                      <Flex wrap="wrap" gap={8}>
                        {variants?.[field.name]?.values?.map((v) => (
                          <Button
                            key={v}
                            onClick={() => removeVariantValue(field.name, v)}
                          >
                            {v}
                          </Button>
                        ))}
                      </Flex>
                    </Card>
                  </Col>
                ))}
                <Row>
                  <Space size={16} direction="vertical">
                    <Button
                      onClick={() => add()}
                      type="primary"
                      icon={<Add />}
                      size="large"
                    ></Button>
                    {!!variants?.length && (
                      <Button
                        onClick={handleShowVariantValuesTable}
                        type="primary"
                        icon={<ArrowRight />}
                        size="large"
                        disabled={!canShowVariantValuesTable}
                      ></Button>
                    )}
                  </Space>
                </Row>
              </Row>
            )}
          </Form.List>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <Table
              columns={variantValuesTableData.current.columns}
              dataSource={variantValuesTableData.current.body}
              pagination={false}
              bordered
              scroll={{ x: 1000 }}
            />
            <Button
              style={{ marginTop: 8 }}
              icon={<ArrowLeft size={20} />}
              onClick={() => setEditingVariants(true)}
            />
          </div>
        )}

        <Form.Item<ProductForm>
          label="Ảnh sản phẩm"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload
            listType="picture-card"
            accept="image/*"
            multiple
            onPreview={handlePreview}
            beforeUpload={() => false}
          >
            <button
              style={{ border: 0, background: "none", color: "#ffffff" }}
              type="button"
            >
              <Add />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item<ProductForm> label="Mô tả sản phẩm">
          <ReactQuill
            theme="snow"
            modules={{ toolbar: PRODUCT_EDITOR_OPTION.toolbar }}
            formats={PRODUCT_EDITOR_OPTION.format}
            placeholder="Nói gì đó về sản phẩm..."
            style={{ color: "white" }}
          />
        </Form.Item>

        <Typography.Title level={5}>Dữ liệu hỗ trợ SEO</Typography.Title>
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <Form.Item label="Từ khóa">
              <Input.TextArea
                placeholder="Từ khóa SEO cho sản phẩm: Áo thun nam Áo nam ao thun..."
                style={{ resize: "none" }}
                rows={3}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item label="Mô tả">
              <Input.TextArea
                placeholder="Mô tả sản phẩm trên kết quả tìm kiếm: Áo thun nam chất lượng cao..."
                style={{ resize: "none" }}
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo sản phẩm
            </Button>
          </Form.Item>
        </Row>
      </Form>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}

export default ProductDetail;
