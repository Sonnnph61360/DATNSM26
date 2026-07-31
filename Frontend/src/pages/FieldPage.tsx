import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Input,
  Select,
  Button,
  List,
  Tag,
  Pagination,
  Radio,
} from "antd";

import {
  SearchOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";

import "./FieldPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Stadium {
  id: number;
  name: string;
  location: string;
  sport: string;
  fields: number;
  image: string;
}

const stadiums: Stadium[] = [
  {
    id: 1,
    name: "002 PB Club",
    location: "Thủ Đức, TP Hồ Chí Minh",
    sport: "Pickleball",
    fields: 8,
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800",
  },
  {
    id: 2,
    name: "Sân bóng Green",
    location: "Cầu Giấy, Hà Nội",
    sport: "Bóng đá",
    fields: 5,
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
  },
  {
    id: 3,
    name: "Victory Arena",
    location: "Biên Hòa, Đồng Nai",
    sport: "Bóng đá",
    fields: 6,
    image:
      "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800",
  },
];

const FieldPage = () => {
  return (
    <Layout style={{ background: "#f5f5f5" }}>
      <div className="field-hero">
        <Title style={{ color: "#fff", marginBottom: 10 }}>
          Tìm sân thể thao
        </Title>

        <Text style={{ color: "#fff", fontSize: 16 }}>
          Tìm hơn 400 sân thể thao trên toàn quốc
        </Text>

        <Row gutter={16} style={{ marginTop: 35 }}>
          <Col xs={24} md={8}>
            <Input
              size="large"
              prefix={<SearchOutlined />}
              placeholder="Tên sân..."
            />
          </Col>

          <Col xs={24} md={6}>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Loại sân"
              options={[
                {
                  value: "football",
                  label: "Bóng đá",
                },
                {
                  value: "pickle",
                  label: "Pickleball",
                },
                {
                  value: "badminton",
                  label: "Cầu lông",
                },
              ]}
            />
          </Col>

          <Col xs={24} md={6}>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Tỉnh / Thành phố"
              options={[
                {
                  value: "hn",
                  label: "Hà Nội",
                },
                {
                  value: "hcm",
                  label: "Hồ Chí Minh",
                },
                {
                  value: "dn",
                  label: "Đà Nẵng",
                },
              ]}
            />
          </Col>

          <Col xs={24} md={4}>
            <Button type="primary" size="large" block>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </div>

      <Content style={{ padding: 40 }}>
        <Row gutter={24}>

          <Col xs={24} lg={6}>
            <Card title="Loại sân">
              <List
                dataSource={[
                  "Tất cả",
                  "Bóng đá",
                  "Pickleball",
                  "Cầu lông",
                  "Tennis",
                  "Bóng rổ",
                ]}
                renderItem={(item) => (
                  <List.Item style={{ cursor: "pointer" }}>
                    {item}
                  </List.Item>
                )}
              />
            </Card>
          </Col>


          <Col xs={24} lg={18}>
            <Card
              title={`${stadiums.length} sân thể thao`}
              extra={
                <Radio.Group defaultValue="list">
                  <Radio.Button value="list">
                    <BarsOutlined />
                  </Radio.Button>

                  <Radio.Button value="grid">
                    <AppstoreOutlined />
                  </Radio.Button>
                </Radio.Group>
              }
            >
              {stadiums.map((item) => (
                <Card
                  key={item.id}
                  style={{
                    marginBottom: 20,
                  }}
                  hoverable
                >
                  <Row gutter={20} align="middle">
                    <Col xs={24} md={7}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Title level={4}>{item.name}</Title>

                      <p>
                        <EnvironmentOutlined /> {item.location}
                      </p>

                      <Tag color="green">{item.sport}</Tag>

                      <Tag color="blue">
                        {item.fields} sân
                      </Tag>
                    </Col>

                    <Col xs={24} md={5}>
                      <Button
                        type="primary"
                        block
                        style={{ marginBottom: 10 }}
                      >
                        Đặt sân
                      </Button>

                      <Button block>
                        Chi tiết
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 30,
                }}
              >
                <Pagination
                  current={1}
                  total={60}
                  pageSize={6}
                  showSizeChanger={false}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default FieldPage;