import ProductFormLoading from "@/components/loading/ProductFormLoading";
import { antdCtx } from "@/context";
import { path } from "@/routes/path";
import { brandApi } from "@/services/api/brand";
import { categoryApi } from "@/services/api/category";
import { productApi } from "@/services/api/product";
import { CreateProductPayload, ProductType } from "@/services/api/type/product";
import { upload } from "@/services/api/upload";
import {
  CATEGORY_TYPE,
  PRODUCT_EDITOR_OPTION,
  PRODUCT_UNIT,
  RULES,
} from "@/utils/constants";
import { combineArrays } from "@/utils/functions";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  SelectProps,
  Space,
  Table,
  TableProps,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile, UploadProps } from "antd/es/upload";
import { Add, ArrowLeft, ArrowRight, Trash } from "iconsax-react";
import {
  KeyboardEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type ProductForm = {
  name: string;
  categoryId: number;
  brandId: number;
  unit: string;
  hasMultiOptions: boolean;
  price: number;
  salePercent: number;
  quantity: number;
  description: string;
  seoKeyword: string;
  seoDescription: string;
  variants: {
    type: string;
    values: string[];
  }[];
  images: UploadFile[];
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notificationApi } = useContext(antdCtx);
  const [form] = Form.useForm<ProductForm>();
  const isCreateMode = id === "new";
  const isViewMode = searchParams.get("action") === "view";
  const isEditMode = searchParams.get("action") === "edit";

  const hasMultiOptions = Form.useWatch<boolean>(["hasMultiOptions"], form);
  const variants = Form.useWatch<ProductForm["variants"] | undefined>(
    ["variants"],
    form
  );
  const images = Form.useWatch<UploadProps["fileList"]>(["images"], form);

  const variantValuesTableData = useRef<VariantValuesTableData>({
    columns: [],
    body: [],
  });

  const [data, setData] = useState<ProductType>();
  const [variantInputs, setVariantInputs] = useState<Record<number, string>>(
    {}
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [editingVariants, setEditingVariants] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<
    SelectProps["options"]
  >([]);
  const [brandOptions, setBrandOptions] = useState<SelectProps["options"]>([]);
  const [loading, setLoading] = useState(false);

  const canShowVariantValuesTable = useMemo(() => {
    return !variants?.some((item) => !item?.type || !item?.values?.length);
  }, [variants]);

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

  const backupFormData = () => {
    const data = form.getFieldsValue() as ProductForm;

    const pVariants = form.getFieldValue("variants") ?? variants;
    if (pVariants) {
      data.variants = pVariants;
    }
    data.variantValues = variantValuesTableData.current.body;
    localStorage.setItem("product-form", JSON.stringify(data));
    return data;
  };

  const handleSubmit = async () => {
    const formData = backupFormData();

    try {
      setLoading(true);
      const images = formData.images ?? [];
      const uploadRes = await Promise.all(
        images.map((img) => {
          if (img.url) {
            return Promise.resolve({ data: { image: { url: img.url } } });
          }
          return upload(formData.name, img.originFileObj as RcFile);
        })
      );
      const imageUrls = uploadRes.map((item) => item.data.image.url);
      const payload: CreateProductPayload = {
        name: formData.name,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        unit: formData.unit,
        images: imageUrls,
        description: formData.description,
        seoKeyword: formData.seoKeyword,
        seoDescription: formData.seoDescription,
        salePercent: formData.salePercent,
      };
      if (formData.hasMultiOptions) {
        payload.variantProps = formData.variants;

        payload.variants = formData.variantValues.map((item) => {
          const result = {} as NonNullable<
            CreateProductPayload["variants"]
          >[number];
          const values: string[] = [];
          Object.keys(item).forEach((key) => {
            if (!isNaN(Number(key))) {
              values.push(item[key].toString());
            }
          });
          result.price = Number(item.price);
          result.stockQuantity = Number(item.quantity);
          result.values = values;

          return result;
        });
      } else {
        payload.price = formData.price;
        payload.stockQuantity = formData.quantity;
      }
      const api = isEditMode
        ? productApi.update(Number(id), payload)
        : productApi.create(payload);
      await api;
      notificationApi?.success({
        message: "Thành công",
      });

      navigate(path.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    if (Number(id)) {
      productApi
        .getById(Number(id))
        .then((res) => {
          const productData = res.data.product;
          setData(productData);
          form.setFieldsValue({
            ...productData,
            images: productData.images?.map((url) => ({ url })),
            quantity: productData.stockQuantity,
            hasMultiOptions:
              productData.variantProps?.length > 0 &&
              productData.variants?.length > 0,
            variants: productData.variantProps,
            variantValues: productData.variants.map((item, index) => ({
              key: index,
              price: item.price,
              quantity: item.stockQuantity,
              ...item.values.reduce((acc, crr, index) => {
                acc[index] = crr;
                return acc;
              }, {} as Record<number, string>),
            })),
          });
        })
        .catch();
    }
  };

  useEffect(() => {
    setInterval(() => {
      backupFormData();
    }, 10000000);

    fetchData();

    categoryApi
      .getAll()
      .then((res) => {
        setCategoryOptions(
          res.data.categories
            .filter((item) => item.parentId === CATEGORY_TYPE.PRODUCT)
            .map((item) => ({
              label: item.name,
              value: item.id,
            }))
        );
      })
      .catch();

    brandApi
      .getAll()
      .then((res) => {
        setBrandOptions(
          res.data.brands.map((item) => ({ label: item.name, value: item.id }))
        );
      })
      .catch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data && !isCreateMode) {
    return <ProductFormLoading />;
  }

  return (
    <div>
      <Typography.Title level={3}>
        {isCreateMode
          ? "Thêm sản phẩm mới"
          : isViewMode
          ? "Thông tin sản phẩm"
          : "Cập nhật sản phẩm"}
      </Typography.Title>

      <Form<ProductForm>
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        disabled={isViewMode}
      >
        <Typography.Title level={5}>Thông tin sản phẩm</Typography.Title>
        <Row gutter={[16, 16]}>
          <Col span={24} md={8}>
            <Form.Item<ProductForm>
              name="name"
              label="Tên sản phẩm"
              rules={[RULES.REQUIRED]}
            >
              <Input placeholder="Áo thun nam LV" />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item<ProductForm>
              name="categoryId"
              label="Danh mục"
              rules={[RULES.REQUIRED]}
            >
              <Select
                options={categoryOptions}
                style={{ width: "100%" }}
                placeholder="Thời trang"
              />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item<ProductForm> name="brandId" label="Thương hiệu">
              <Select
                options={brandOptions}
                style={{ width: "100%" }}
                placeholder="One"
              />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item<ProductForm>
              name="unit"
              label="Đơn vị"
              rules={[RULES.REQUIRED]}
            >
              <Select
                options={PRODUCT_UNIT.map((u) => ({ label: u, value: u }))}
                style={{ width: "100%" }}
                placeholder="Cái"
              />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item<ProductForm> name="salePercent" label="Khuyến mãi">
              <InputNumber style={{ width: "100%" }} placeholder="33.33%" />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
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
              <Form.Item<ProductForm> name="price" label="Giá gốc">
                <InputNumber style={{ width: "100%" }} placeholder="167000đ" />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item<ProductForm> name="quantity" label="Số lượng sản phẩm">
                <InputNumber style={{ width: "100%" }} placeholder="24" />
              </Form.Item>
            </Col>
          </Row>
        ) : editingVariants ? (
          <VariantTypeForm
            canShowVariantValuesTable={canShowVariantValuesTable}
            form={form}
            setEditingVariants={setEditingVariants}
            setVariantInputs={setVariantInputs}
            variantInputs={variantInputs}
            variantValuesTableData={variantValuesTableData}
            variants={variants}
          />
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
              disabled={false}
            />
          </div>
        )}

        <Form.Item<ProductForm> label="Ảnh sản phẩm" name="images">
          <ImgCrop aspect={4 / 3}>
            <Upload
              listType="picture-card"
              accept="image/*"
              multiple
              fileList={images}
              onPreview={handlePreview}
              onChange={({ fileList }) => {
                form.setFieldValue("images", fileList);
              }}
            >
              <button
                style={{ border: 0, background: "none", color: "#ffffff" }}
                type="button"
              >
                <Add />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item<ProductForm> name="description" label="Mô tả sản phẩm">
          <ReactQuill
            theme="snow"
            modules={{ toolbar: PRODUCT_EDITOR_OPTION.toolbar }}
            formats={PRODUCT_EDITOR_OPTION.format}
            placeholder="Nói gì đó về sản phẩm..."
            style={{ color: "white" }}
            readOnly={isViewMode}
          />
        </Form.Item>

        <Typography.Title level={5}>Dữ liệu hỗ trợ SEO</Typography.Title>
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <Form.Item<ProductForm> name="seoKeyword" label="Từ khóa">
              <Input.TextArea
                placeholder="Từ khóa SEO cho sản phẩm: Áo thun nam Áo nam ao thun..."
                style={{ resize: "none" }}
                rows={3}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item<ProductForm> name="seoDescription" label="Mô tả">
              <Input.TextArea
                placeholder="Mô tả sản phẩm trên kết quả tìm kiếm: Áo thun nam chất lượng cao..."
                style={{ resize: "none" }}
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          {!isViewMode && (
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
              </Button>
            </Form.Item>
          )}
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

type VariantTypeFormProps = {
  variants: ProductForm["variants"] | undefined;
  form: FormInstance;
  setVariantInputs: (v: Record<number, string>) => void;
  variantInputs: Record<number, string>;
  variantValuesTableData: React.MutableRefObject<VariantValuesTableData>;
  setEditingVariants: (v: boolean) => void;
  canShowVariantValuesTable: boolean;
};

function VariantTypeForm({
  form,
  setVariantInputs,
  variants,
  variantInputs,
  variantValuesTableData,
  canShowVariantValuesTable,
  setEditingVariants,
}: VariantTypeFormProps) {
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
    const variantValues = form.getFieldValue("variantValues");

    combineArr.forEach((item, index) => {
      const price = variantValues?.[index]?.price ?? "";
      const quantity = variantValues?.[index]?.quantity ?? "";
      tableData.body.push({
        key: index,
        price,
        quantity,
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
              defaultValue={tableData.body[index].price}
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
      // {
      //   key: "salePercent",
      //   dataIndex: "salePercent",
      //   title: "Khuyến mãi(%)",
      //   render(__, _, index) {
      //     return (
      //       <InputNumber
      //         style={{ width: "100%" }}
      //         placeholder="33.33%"
      //         onBlur={(v) => {
      //           const vdata = getVariantValuesWhenUpdatePrice(
      //             variantValuesTableData.current,
      //             index,
      //             "salePercent",
      //             Number(v.target.value)
      //           );
      //           variantValuesTableData.current = vdata;
      //         }}
      //       />
      //     );
      //   },
      // },
      {
        key: "quantity",
        dataIndex: "quantity",
        title: "Số lượng",
        render(__, _, index) {
          return (
            <InputNumber
              style={{ width: "100%" }}
              defaultValue={tableData.body[index].quantity}
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

  return (
    <Form.List name="variants" initialValue={[{ type: "", variants: [] }]}>
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
                      onKeyDown={(e) => handleEnterVariantValue(e, field.name)}
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
  );
}

export default ProductDetail;
