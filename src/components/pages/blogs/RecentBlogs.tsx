'use client'
import api from '@/libs/axios';
import PageHeader from '@/components/atoms/PageHeader';
import { MdArticle } from 'react-icons/md';
import { AnimatedSecondaryButton } from "@/components/atoms/buttons/AnimatedSecondaryButton";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { resolveUrl } from "@/utils/upload";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RichTextRenderer from '@/components/molecules/forms/editor/RichTextRenderer';
import { cn } from '@/lib/utils';

export default function RecentBlogs({ slug }: { slug?: string }) {
    const t = useTranslations('blogs');
    // State
    const [recentBlog, setRecentBlog] = useState<ViewBlog | null>(null);
    const [blogs, setBlogs] = useState<ViewBlog[]>([]);
    const [cursor, setCursor] = useState<string>('');
    const [hasMore, setHasMore] = useState<boolean>(false);

    // Loading States
    const [initialLoading, setInitialLoading] = useState<boolean>(true);

    // 1. Fetch Initial Data
    useEffect(() => {
        const fetchInitialData = async () => {
            setInitialLoading(true);
            try {
                const [recentRes, blogsRes] = await Promise.all([
                    slug ? api.get(`/blogs/${slug}`) : api.get('/blogs/recent'),
                    api.get('/blogs?limit=9'),
                ]);

                setRecentBlog(recentRes.data);
                setBlogs(blogsRes.data.items || []);
                setCursor(blogsRes.data.nextCursor || '');
                setHasMore(blogsRes.data.hasMore || false);
            } catch (err) {
                console.error('Error fetching blogs:', err);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchInitialData();
    }, [slug]);


    if (initialLoading) {
        return (
            <div className="bg-highlight pb-20 sm:pb-32 px-4">
                <div className="container max-w-7xl mx-auto">
                    <PageHeader title={t('blogs')} className="bg-highlight mb-10" />
                    <BlogCardSkeleton list />
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    if (!recentBlog && blogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                <div className="mb-6 rounded-full bg-gray-100 p-6">
                    <MdArticle size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('empty.title')}</h3>
                <p className="text-sm text-gray-500 max-w-md">{t('empty.description')}</p>
            </div>
        );
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




export interface ViewBlog {
    id: string;
    slug: string;
    imagePath: string;
    title_ar: string;
    title_en: string;
    description_ar?: string;
    description_en?: string;
    created_at: string | Date;
};
interface BlogProps {
    blog: ViewBlog
    list?: boolean;
}



function BlogCard({ blog, list = false }: BlogProps) {
    const t = useTranslations("blogs");
    const locale = useLocale();
    const isAr = locale === 'ar';
    const title = isAr ? blog.title_ar : blog.title_en;
    const description = isAr ? blog.description_ar : blog.description_en;
    const formattedDate = new Date(blog.created_at).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <article
            className={cn(
                "group overflow-hidden relative w-full rounded-2xl",
                "flex flex-col",
                "transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10",
                "animate__animated animate__fadeInUp",
                list
                    ? "space-y-6 lg:space-y-8"
                    : "max-w-[420px] mx-auto space-y-5"
            )}
        >
            {/* Image Container */}
            <Link href={`/blogs/${blog.slug}`} className="relative block overflow-hidden rounded-2xl">
                {/* Gradient overlay on hover */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/20 to-transparent z-10",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                )} />

                {/* Date Badge (only for grid view) */}
                {!list && (
                    <div className={cn(
                        "absolute top-4 ltr:left-4 rtl:right-4 z-20",
                        "bg-dashboard-bg/95 backdrop-blur-md rounded-xl px-4 py-2",
                        "shadow-lg border border-secondary/20",
                        "transform transition-all duration-300",
                        "group-hover:scale-105"
                    )}>
                        <time className="text-xs md:text-sm font-bold text-primary">
                            {formattedDate}
                        </time>
                    </div>
                )}

                {/* Image */}
                <Image
                    src={resolveUrl(blog.imagePath)}
                    alt={title}
                    width={600}
                    height={450}
                    loading="eager"
                    fetchPriority="high"
                    className={cn(
                        "w-full object-cover",
                        "transition-all duration-700",
                        "group-hover:scale-110 group-hover:rotate-1",
                        list
                            ? "h-[380px] sm:h-[420px] md:h-[460px] lg:h-[500px]"
                            : "h-[220px] sm:h-[260px] md:h-[300px] lg:h-[360px]"
                    )}
                />
            </Link>

            {/* Content Container */}
            <div className={cn(
                "flex-1 flex flex-col gap-3 lg:gap-4 px-1",
                list && "md:px-2"
            )}>
                {/* Title */}
                <Link
                    href={`/blogs/${blog.slug}`}
                    className={cn(
                        "block font-bold text-dark leading-tight tracking-tight",
                        "transition-all duration-300 hover:text-primary",
                        "group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
                        list
                            ? "text-2xl md:text-3xl lg:text-4xl"
                            : "text-xl md:text-2xl"
                    )}
                >
                    {title}
                </Link>

                {/* Description */}
                <div className={cn(
                    "text-grey-dark/80 leading-relaxed",
                    "transition-colors duration-300 group-hover:text-grey-dark",
                    list
                        ? "text-base md:text-lg line-clamp-4"
                        : "text-sm md:text-base line-clamp-3"
                )}>
                    <RichTextRenderer
                        content={description}
                        className="prose prose-sm max-w-none"
                    />
                </div>

                {/* Date for list view */}
                {list && (
                    <time className="text-placeholder text-sm md:text-base font-medium">
                        {formattedDate}
                    </time>
                )}

                {/* Read More Button (grid view only) */}
                {!list && (
                    <div className="mt-auto pt-3">
                        <Link href={`/blogs/${blog.slug}`}>
                            <CustomReadMoreButton>
                                {t("readMore")}
                            </CustomReadMoreButton>
                        </Link>
                    </div>
                )}
            </div>
        </article>
    );
}

/* Custom Read More Button Component */
function CustomReadMoreButton({ children }: { children: React.ReactNode }) {
    return (
        <button
            className={cn(
                "group/btn relative inline-flex items-center gap-2",
                "px-6 py-2.5 rounded-full overflow-hidden",
                "bg-gradient-to-r from-secondary to-primary",
                "text-white font-semibold text-sm md:text-base",
                "shadow-lg hover:shadow-xl hover:shadow-secondary/30",
                "transition-all duration-300",
                "hover:scale-105 active:scale-95",
                "mx-auto"
            )}
        >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

            {/* Text */}
            <span className="relative z-10">{children}</span>

            {/* Arrow Icon */}
            <svg
                className={cn(
                    "relative z-10 w-4 h-4",
                    "transition-transform duration-300",
                    "group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
            </svg>

            {/* Ripple effect */}
            <span className="absolute inset-0 rounded-full bg-white/0 group-hover/btn:bg-white/10 transition-colors duration-300" />
        </button>
    );
}

export function BlogCardSkeleton({ list = false }: { list?: boolean }) {
    return (
        <div className={`overflow-hidden w-full  relative ${!list && "max-w-[400px]"} rounded-[16px] flex ${list ? "flex-col w-full space-y-6" : "flex-col w-fit mx-auto space-y-7"} animate-pulse`}>
            <div className={`w-full ${list ? "h-[380px] sm:h-[400px] md:h-[420px] lg:h-[450px]" : "max-w-[400px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[360px]"} bg-gray-200 rounded-[16px]`}></div>
            <div className={`flex-1 flex flex-col gap-2 lg:gap-4 z-[1] mb-4 ${list ? "mt-5 md:mt-3" : ""}`}>
                {!list && <div className="h-4 w-1/3 bg-gray-300 rounded"></div>}
                <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                <div className={`h-4 ${list ? "w-full" : "w-5/6"} bg-gray-300 rounded mt-2`}></div>
                {!list && <div className="mx-auto h-10 w-32 bg-gray-300 rounded"></div>}
            </div>
        </div>
    );
}



interface props {
    recentId: string,
    InitailBlogs: ViewBlog[],
    initialCursor: string,
    initialHasMore: boolean
}
function FetchMoreBlogs({ recentId, InitailBlogs, initialCursor, initialHasMore }: props) {
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