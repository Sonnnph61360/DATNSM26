
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input, Form, Button, Switch } from "antd";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";


function EditPage() {
  const [form]=Form.useForm();
  const {id}=useParams();
  const nav = useNavigate();
  const{data}=useQuery<any>({
    queryKey:["students",id],
    queryFn:async()=>{
      const res=await axios.get(`http://localhost:3000/students/${id}`)
      return res.data;
    }
  })

 useEffect(() => {
  if (data) {
   form.setFieldsValue(data);
  }
 }, [data, form]);


  const{mutate}=useMutation({
    mutationFn:async(value:any)=>{
      await axios.put(`http://localhost:3000/students/${id}`,value)
    
    },
    onSuccess:()=>{
      toast.success("Thên thành công");
      nav("/list")
    },
    onError:()=>{
      toast.error("Lỗi thêm không thành công")
    }
  })

 const onSubmit=(value:any)=>{
  console.log("Success",value)
  mutate(value)
  }

  return (
    <div className="p-6">
      <h1>Sửa Student</h1>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="fullName" label="Tên">
          <Input />
        </Form.Item>

        <Form.Item name="age" label="Tuổi">
          <Input type="number" />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>

        <Form.Item name="active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Button htmlType="submit" type="primary">
          Update
        </Button>
      </Form>
    </div>
  );
}

export default EditPage;
