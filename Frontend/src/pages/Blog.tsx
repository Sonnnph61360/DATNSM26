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
  Pagination,
} from "antd";

import {
  CalendarOutlined,
  ArrowRightOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import "./Blog.css";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

interface Blog {
  id: number;
  title: string;
  category: string;
  image: string;
  desc: string;
  date: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    title: "Top 10 phần mềm quản lý sân bóng tốt nhất",
    category: "Phần mềm",
    image:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=900",
    desc: "Tổng hợp những phần mềm quản lý sân bóng được nhiều chủ sân lựa chọn hiện nay.",
    date: "31/07/2026",
  },
  {
    id: 2,
    title: "Kinh nghiệm kinh doanh sân bóng hiệu quả",
    category: "Kinh doanh",
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900",
    desc: "Những kinh nghiệm giúp tăng doanh thu và thu hút khách hàng.",
    date: "30/07/2026",
  },
  {
    id: 3,
    title: "5 xu hướng sân thể thao năm 2026",
    category: "Xu hướng",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900",
    desc: "Những xu hướng nổi bật trong ngành sân thể thao hiện nay.",
    date: "29/07/2026",
  },
  {
    id: 4,
    title: "Cách chăm sóc mặt cỏ sân bóng",
    category: "Hướng dẫn",
    image:
      "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=900",
    desc: "Hướng dẫn bảo dưỡng và chăm sóc mặt sân đúng cách.",
    date: "28/07/2026",
  },
];

const Blog = () => {
  return (
    <Layout style={{ background: "#f5f5f5" }}>
      <div className="hero">
        <Tag color="green" style={{ padding: "6px 18px" }}>
          BLOG
        </Tag>

        <Title style={{ color: "#fff", marginTop: 20 }}>
          Kiến Thức Quản Lý Sân Thể Thao
        </Title>

        <Paragraph
          style={{
            color: "#fff",
            fontSize: 16,
            maxWidth: 700,
            margin: "auto",
          }}
        >
          Tổng hợp kiến thức, hướng dẫn và kinh nghiệm quản lý sân bóng, sân
          pickleball, cầu lông và nhiều lĩnh vực thể thao khác.
        </Paragraph>

        <Search
          size="large"
          placeholder="Tìm kiếm bài viết..."
          prefix={<SearchOutlined />}
          style={{
            maxWidth: 650,
            marginTop: 30,
          }}
        />
      </div>

      <Content style={{ padding: "40px 80px" }}>
        <Row gutter={24}>
          <Col xs={24} lg={17}>
            <Row gutter={[20, 20]}>
              {blogs.map((item) => (
                <Col xs={24} md={12} key={item.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        src={item.image}
                        alt={item.title}
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

                    <div className="blog-footer">
                      <Text type="secondary">
                        <CalendarOutlined /> {item.date}
                      </Text>

                      <Button type="link">
                        Đọc tiếp <ArrowRightOutlined />
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <div
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                current={1}
                total={40}
                pageSize={8}
                showSizeChanger={false}
              />
            </div>
          </Col>

          {/* RIGHT */}
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
                  <List.Item style={{ cursor: "pointer" }}>
                    {item}
                  </List.Item>
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
                    <Text>{item.title}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Blog;