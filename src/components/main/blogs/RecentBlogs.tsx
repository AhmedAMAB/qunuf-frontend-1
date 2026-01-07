import api from '@/libs/axios';
import BlogCard, { ViewBlog } from './BlogCard';
import PageHeader from '@/components/shared/PageHeader';
import { Blog } from '@/types/dashboard/blog';
import FetchMoreBlogs from './FetchMoreBlogs';
import { getTranslations } from 'next-intl/server';
import EmptyState from '@/components/shared/EmptyState';
import { MdArticle } from 'react-icons/md';

export default async function RecentBlogs({ slug }: { slug?: string }) {
    const t = await getTranslations('blogs');

    // ----------------------------------------
    // Fetch recent blog + paginated blogs together
    // ----------------------------------------
    let recentBlog: Blog | null = null;
    let blogs: ViewBlog[] = [];
    let cursor: string;
    let hasMore: boolean;

    try {
        const [recentRes, blogsRes] = await Promise.all([
            slug ? api.get(`/blogs/${slug}`) : api.get('/blogs/recent'),
            api.get('/blogs?limit=9'),
        ]);

        recentBlog = recentRes.data;
        blogs = blogsRes.data.items || [];
        cursor = blogsRes.data.nextCursor || '';
        hasMore = blogsRes.data.hasMore || false;
    } catch (err) {
        console.error('Error fetching blogs:', err);
    }


    if (!blogs.length && !recentBlog) {
        return (<div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="mb-6 rounded-full bg-gray-100 p-6">
                <MdArticle size={48} className="text-gray-400" />
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t('empty.title')}
            </h3>

            <p className="text-sm text-gray-500 max-w-md">
                {t('empty.description')}
            </p>
        </div>)
    }
    return (
        <div className="bg-highlight pb-20 sm:pb-26 lg:pb-32 px-2">
            <div className="container">
                <PageHeader title={t('blogs')} className="bg-highlight" />

                {/* Most recent blogs carousel/grid */}

                <BlogCard key={recentBlog.id} blog={recentBlog} list />

                <h1 className="font-bold text-3xl md:text-4xl lg:text-[50px] mb-3 text-secondary">
                    {t('our')} <span className="text-black">{t('recentBlogs')}</span>
                </h1>

                <FetchMoreBlogs InitailBlogs={blogs} initialCursor={cursor} initialHasMore={hasMore} recentId={recentBlog.id} />
            </div>
        </div>
    );
}

