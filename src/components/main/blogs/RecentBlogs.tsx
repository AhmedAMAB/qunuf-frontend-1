import api from '@/libs/axios';
import BlogCard, { ViewBlog } from './BlogCard';
import PageHeader from '@/components/shared/PageHeader';
import { Blog } from '@/types/dashboard/blog';
import FetchMoreBlogs from './FetchMoreBlogs';
import { getTranslations } from 'next-intl/server';

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

