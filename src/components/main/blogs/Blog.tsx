import { AnimatedSecondaryButton } from "@/components/shared/buttons/AnimatedSecondaryButton";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface BlogProps {
    blog: {
        id: string | number;
        title: string;
        description: string;
        imageUrl: string;
        createdAt: string; // 👈 new date prop
    };
    list?: boolean;
}


export default function Blog({ blog, list = false }: BlogProps) {
    const t = useTranslations("blogs.recent");

    return (
        <div className={`overflow-hidden relative ${!list && "max-w-[400px]"} rounded-[16px] flex ${list ? "flex-col md:flex-row w-full md:space-x-10 space-y-7 md:space-y-0" : "flex-col w-fit mx-auto space-y-7"}`}>

            <Image
                src={blog.imageUrl}
                alt={blog.title}
                width={400}
                height={360}
                className={`w-full ${list ? "md:max-w-[400px] lg:max-w-[600px] xl:max-w-[712px]" : "max-w-[400px]"
                    } h-[200px] sm:h-[250px] md:h-[300px] lg:h-[360px] rounded-[16px] object-cover image-scale`}
            />

            <div className={`flex-1 text-start flex flex-col gap-2 lg:gap-4 z-[1] mb-4 ${list ? "mt-5 md:mt-3" : ""}`}>

                <p className="font-medium text-placeholder text-[13px]">{blog.createdAt}</p>
                <Link
                    href={`/blogs/${blog.id}`}
                    className="block font-bold text-xl md:text-2xl text-black"
                >
                    {blog.title}
                </Link>

                <p className="text-sm md:text-base font-medium text-dark ">
                    {blog.description}
                </p>

                <AnimatedSecondaryButton large={false} position="end">
                    {t("readMore")}
                </AnimatedSecondaryButton>
            </div>
        </div>
    );
}
