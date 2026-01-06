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
        created_at: string;
    };
    list?: boolean;
}


export default function Blog({ blog, list = false }: BlogProps) {
    const t = useTranslations("blogs");

    return (
        <div className={`overflow-hidden relative ${!list && "max-w-[400px]"} rounded-[16px] flex ${list ? "flex-col  w-full  space-y-6" : "flex-col w-fit mx-auto space-y-7"}`}>

            <Image
                src={blog.imageUrl}
                alt={blog.title}
                width={400}
                height={360}
                className={`w-full ${list ? "w-full h-[380px] sm:h-[400px] md:h-[420px] lg:h-[450px]" : "max-w-[400px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[360px]"
                    } h-[200px] sm:h-[250px] md:h-[300px] lg:h-[360px] rounded-[16px] object-cover image-scale`}
            />

            <div className={`flex-1 text-start flex flex-col gap-2 lg:gap-4 z-[1] mb-4 ${list ? "mt-5 md:mt-3" : ""}`}>

                {!list && <p className="font-medium text-placeholder text-[13px]">{blog.created_at}</p>}
                <Link
                    href={`/blogs/${blog.id}`}
                    className="block font-bold text-xl md:text-2xl text-black"
                >
                    {blog.title}
                </Link>

                <p className={` font-medium text-dark ${list ? "whitespace-pre-line text-lg md:text-xl" : "text-sm md:text-base"}`}>
                    {blog.description}
                </p>

                {!list && <div className="mx-auto">

                    <AnimatedSecondaryButton large={false} position="end" showBall={false}>
                        {t("readMore")}
                    </AnimatedSecondaryButton>
                </div>}
            </div>
        </div>
    );
}
