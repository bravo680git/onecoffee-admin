import { Row, Skeleton } from "antd";

function TableLoading() {
  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Skeleton.Input style={{ height: 20, width: 240 }} />
        <Skeleton.Button active />
      </Row>
      <Skeleton.Input block active style={{ height: 400 }} />
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          marginTop: 16,
        }}
      >
        <Skeleton.Button
          style={{ minWidth: 0, width: 32 }}
          active
          shape="square"
        />
        <Skeleton.Button
          style={{ minWidth: 0, width: 32 }}
          active
          shape="square"
        />
        <Skeleton.Button
          style={{ minWidth: 0, width: 32 }}
          active
          shape="square"
        />
      </div>
    </div>
  );
}

export default TableLoading;
