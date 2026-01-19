import { AnimatedSecondaryButton } from "@/components/shared/buttons/AnimatedSecondaryButton";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { resolveUrl } from "@/utils/upload";

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


export default function BlogCard({ blog, list = false }: BlogProps) {
    const t = useTranslations("blogs");
    const locale = useLocale()
    const isAr = locale === 'ar';
    const title = isAr ? blog.title_ar : blog.title_en;
    const description = isAr ? blog.description_ar : blog.description_en;
    const formattedDate = new Date(blog.created_at).toLocaleDateString('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className={`overflow-hidden relative w-full ${!list && "max-w-[400px]"} rounded-[16px] flex ${list ? "flex-col  w-full  space-y-6" : "flex-col w-fit mx-auto space-y-7"}`}>

            <Image
                src={resolveUrl(blog.imagePath)}
                alt={title}
                width={400}
                height={360}
                loading="eager" // Forced eager
                fetchPriority="high"
                className={`w-full ${list ? "w-full h-[380px] sm:h-[400px] md:h-[420px] lg:h-[450px]" : "max-w-[400px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[360px]"
                    } h-[200px] sm:h-[250px] md:h-[300px] lg:h-[360px] rounded-[16px] object-cover image-scale`}
            />

            <div className={`flex-1 text-start flex flex-col gap-2 lg:gap-4 z-[1] mb-4 ${list ? "mt-5 md:mt-3" : ""}`}>

                {!list && <p className="font-medium text-placeholder text-[13px]">{formattedDate}</p>}
                <Link
                    href={`/blogs/${blog.id}`}
                    className="block font-bold text-xl md:text-2xl text-black"
                >
                    {title}
                </Link>

                <p className={` font-medium text-dark ${list ? "whitespace-pre-line text-lg md:text-xl" : "text-sm md:text-base"}`}>
                    {description}
                </p>

                {!list && <div className="mx-auto mt-auto">
                    <Link href={`/blogs/${blog.slug}`}>
                        <AnimatedSecondaryButton large={false} position="end" showBall={false} >
                            {t("readMore")}
                        </AnimatedSecondaryButton>
                    </Link>
                </div>}
            </div>
        </div>
    );
}
