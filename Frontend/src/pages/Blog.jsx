import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Input,
  Tag,
  List,
  Button,
} from "antd";

import {
  CalendarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { blogs } from "./blogData";

import "./blog.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function Blog() {
  const navigate = useNavigate();

  return (
    <Layout style={{ background: "#f5f5f5" }}>

      <div className="hero">

        <Tag color="green" style={{ padding: "6px 18px" }}>
          Blog
        </Tag>

        <Title level={1} style={{ color: "#fff", marginTop: 20 }}>
          Kiến Thức Quản Lý Sân Thể Thao
        </Title>

        <Paragraph style={{ color: "#fff", fontSize: 17 }}>
          Tổng hợp kiến thức, hướng dẫn và kinh nghiệm kinh doanh sân bóng.
        </Paragraph>

        <Search
          placeholder="Tìm bài viết..."
          size="large"
          style={{ maxWidth: 650 }}
        />
      </div>

      <Content style={{ padding: 40 }}>

        <Row gutter={24}>

          <Col xs={24} lg={17}>

            <Row gutter={[20, 20]}>

              {blogs.map((item) => (
                <Col xs={24} md={12} key={item.id}>

                  <Card
                    hoverable
                    onClick={() => navigate(`/blog/${item.id}`)}
                    cover={
                      <img
                        alt=""
                        src={item.image}
                        style={{
                          height: 230,
                          objectFit: "cover",
                        }}
                      />
                    }
                  >
                    <Tag color="green">{item.category}</Tag>

                    <Title level={4}>{item.title}</Title>

                    <Paragraph>{item.desc}</Paragraph>

                    <div className="card-bottom">

                      <span>
                        <CalendarOutlined /> {item.date}
                      </span>

                      <Button type="link">
                        Đọc tiếp <ArrowRightOutlined />
                      </Button>

                    </div>
                  </Card>

                </Col>
              ))}

            </Row>

          </Col>


          <Col xs={24} lg={7}>

            <Card title="Chuyên mục">

              <List
                dataSource={[
                  "Tất cả",
                  "Phần mềm",
                  "Kinh doanh",
                  "Xu hướng",
                  "Hướng dẫn",
                ]}
                renderItem={(item) => (
                  <List.Item>{item}</List.Item>
                )}
              />

            </Card>

            <Card
              title="Bài viết mới"
              style={{ marginTop: 20 }}
            >

              <List
                dataSource={blogs}
                renderItem={(item) => (
                  <List.Item>
                    <Link to={`/blog/${item.id}`} className="text-gray-700 hover:text-green-600">
                      {item.title}
                    </Link>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}