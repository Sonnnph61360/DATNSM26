import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { blogs } from "./blogData";

export default function BlogDetail() {
  const { id } = useParams();
  const post = blogs.find((item) => item.id === Number(id));

  if (!post) {
    return (
      <div className="bg-[#f5f5f5] px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">Không tìm thấy bài viết</h1>
        <p className="mt-3 text-gray-500">Bài viết có thể đã được thay đổi hoặc không còn tồn tại.</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"><ArrowLeft className="h-4 w-4" /> Về Blog</Link>
      </div>
    );
  }

  const related = blogs.filter((item) => item.id !== post.id && item.category === post.category).concat(blogs.filter((item) => item.id !== post.id && item.category !== post.category)).slice(0, 2);

  return (
    <div className="bg-[#f5f5f5] pb-20">
      <div className="hero px-4 py-10 text-left sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Tất cả bài viết</Link>
          <div className="mt-8"><span className="rounded-full bg-green-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">{post.category}</span><h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">{post.title}</h1><div className="mt-5 flex items-center gap-2 text-sm text-white/75"><CalendarDays className="h-4 w-4" /> Đăng ngày {post.date}</div></div>
        </div>
      </div>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-0">
        <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <img src={post.image} alt={post.title} className="h-64 w-full object-cover sm:h-96" />
          <div className="p-6 sm:p-10"><p className="border-l-4 border-green-500 pl-4 text-lg font-semibold leading-8 text-gray-600">{post.desc}</p><div className="mt-8 space-y-6 text-base leading-8 text-gray-700">{post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="mt-10 border-t border-gray-100 pt-6"><Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" /> Xem thêm bài viết</Link></div></div>
        </article>

        <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24"><h2 className="text-lg font-extrabold text-gray-900">Bài viết liên quan</h2><div className="mt-5 space-y-5">{related.map((item) => <Link key={item.id} to={`/blog/${item.id}`} className="group block"><img src={item.image} alt={item.title} className="h-32 w-full rounded-2xl object-cover transition group-hover:opacity-90" /><span className="mt-3 block text-xs font-bold uppercase tracking-wider text-green-600">{item.category}</span><h3 className="mt-1 text-sm font-extrabold leading-6 text-gray-800 group-hover:text-blue-600">{item.title}</h3><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-400">Đọc tiếp <ArrowRight className="h-3 w-3" /></span></Link>)}</div></aside>
      </main>
    </div>
  );
}
