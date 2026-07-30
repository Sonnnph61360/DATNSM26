import { Table } from "antd";
import {useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ListPage() {
  const nav = useNavigate();
  const {data,refetch} = useQuery({
    queryKey:['Students'],
    queryFn:async()=>{
      const res = await axios.get(`http://localhost:3000/Students`);
      return res.data
    }
  })
  const handleDelete = async (id:any) =>{
    if (confirm("Bạn có chắc chắn muốn xóa")) {
      await axios.delete(`http://localhost:3000/Students/${id}`);
      toast.success("Xóa thành công");
      refetch();
    }
  }
  const columns = [
    {title:"Họ và tên",dataIndex:"fullName"},
    {title:"Tuổi",dataIndex:"age"},
    {title:"Địa Chỉ",dataIndex:"address"},
    {title:"Email",dataIndex:"email"},
    {title:"active",dataIndex:"active",render:(value:boolean)=>(value ? "Thành Công":"Thất Bại")},
    {title:"action",render:(_:any,record:any)=>(
      <div>
        <button onClick={()=>handleDelete(record.id)}>Xóa</button>
        <button onClick={() => nav(`/edit/${record.id}`)}>Sửa</button>
      </div>
    )}
  ]
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>

      <div className="overflow-x-auto">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </div>
    </div>
  );
}

export default ListPage;
