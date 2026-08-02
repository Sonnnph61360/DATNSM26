import {Layout,Menu} from 'antd';
import {Link , Outlet, useLocation} from 'react-router-dom';
import { LayoutDashboard, CalendarDays, ClipboardList,MapPin ,LogOut } from 'lucide-react';


const { Header, Sider, Content } = Layout;



export default function AdminLayout() {
    const location = useLocation();

    const menuItems = [
       { key: "/admin/dashboard",
        icon: <LayoutDashboard size={18} />,
        label: <Link to="/admin/dashboard">Tổng quan</Link>,
       },

         {
          key: "/admin/calendar",
          icon: <CalendarDays size={18} />,
          label: <Link to="/admin/calendar">Lịch đặt sân</Link>,
         },

         {
            key: "/admin/bookings",
            icon: <ClipboardList size={18} />,
            label: <Link to="/admin/bookings">Danh sách đơn</Link>,
             },
    
             {
                key: "/admin/courts",
                icon: <MapPin size={18} />,
                label: <Link to="/admin/courts">Quabr lí sân bãi</Link>,
                 },
        
          

    ];



    return (
        <Layout className='min-h-screen font-sans'>

            <Sider width={250} theme='light' className='border-r border-gray-200'>
                <div className='h-16 flex items-center justify-center border-b border-gray-100 nb-4'>
                    <Link to="/" clasNsName='text-xl font-extrabold text-blue-700 flex items-center gap-2'>
                    AdminSystem
                    </Link>

                    </div>


                    <Menu
                    mode='inline'
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    className='border-none px-3 font-medium'
                    />
                    
                     </Sider>
                     <Layout>
                        <Header className='bg-white border-b border-gray-200 px-6 flex justify-between items center h-16'>
                            <h2 className='tex-1g font-bold text-gray-800 m-0'>Hệ thống quản lí</h2>
                            <Link to="/" className="flex items-center text-red-500 hover:text-red-600 font-semibold test-sm">
                            <LogOut size={16} className='mr-1' /> Đăng xuất
                            </Link>
                        </Header>
                        <Content className='p-6 bg-gray-50 overflow-auto'>
                            <Outlet />
                        </Content>
                     </Layout>
        </Layout>
    );
}