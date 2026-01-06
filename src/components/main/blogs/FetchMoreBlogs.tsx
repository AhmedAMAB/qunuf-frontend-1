'use client'
import { AnimatedSecondaryButton } from "@/components/shared/buttons/AnimatedSecondaryButton";
import { useCallback, useMemo, useRef, useState } from "react";
import BlogCard, { ViewBlog } from "./BlogCard";
import { useTranslations } from "next-intl";
import api from "@/libs/axios";
import { BlogCardSkeleton } from "./BlogCardSkeleton";


interface props {
    recentId: string,
    InitailBlogs: ViewBlog[],
    initialCursor: string,
    initialHasMore: boolean
}
export default function FetchMoreBlogs({ recentId, InitailBlogs, initialCursor, initialHasMore }: props) {
    const t = useTranslations('blogs');

    const [blogs, setBlogs] = useState<ViewBlog[]>(InitailBlogs || []);
    const [cursor, setCursor] = useState<string>(initialCursor);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [loading, setLoading] = useState(false);

    const controllerRef = useRef<AbortController | null>(null);

    // ----------------------------------------
    // Fetch blogs with cursor
    // ----------------------------------------
    const fetchBlogs = useCallback(async () => {
        if (!hasMore) return;

        controllerRef.current?.abort(); // cancel previous request
        controllerRef.current = new AbortController();

        setLoading(true);
        try {
            const res = await api.get(
                `/blogs?${cursor ? `cursor=${cursor}&` : ''}limit=9`,
                { signal: controllerRef.current.signal }
            );

            const { items: fetchedBlogs, nextCursor, hasMore: serverHasMore } = res.data;

            setBlogs(prev => [...prev, ...fetchedBlogs]);
            setCursor(nextCursor || null);
            setHasMore(serverHasMore);
        } catch (err) {
            if ((err as any)?.name === 'CanceledError') return;
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    }, [cursor, hasMore, loading]);


    // inside your component
    const filteredBlogs = useMemo(() => {
        if (!blogs || blogs.length === 0) return [];
        return blogs.filter(blog => blog.id !== recentId);
    }, [blogs, recentId]);


    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 mt-6 justify-center mx-4">
                {loading && blogs.length === 0 ? (
                    Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)
                ) : (
                    filteredBlogs.map(blog => <BlogCard key={blog.id} blog={blog} />)
                )}
            </div>
            {hasMore && (
                <div className="flex justify-center mt-8">
                    <AnimatedSecondaryButton
                        large={true}
                        position="end"
                        loading={loading}
                        showBall={false}
                        onClick={fetchBlogs}    // fetch next page
                    >
                        {loading ? t('loadingMore') : t('readMore')}
                    </AnimatedSecondaryButton>
                </div>
            )}
        </div>
    );
}