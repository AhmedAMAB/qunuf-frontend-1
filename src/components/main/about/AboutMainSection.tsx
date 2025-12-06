'use client'
import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface AboutMainSectionProps {
    title: string;
    text: string;
    imageSrc: string;
    reverse?: boolean
}

export default function AboutMainSection({ title, text, imageSrc, reverse = false, ...props }: AboutMainSectionProps) {
    const [expanded, setExpanded] = useState(false);

    const t = useTranslations('about')

    const { previewLimit, hasMore, firstPart, lastPart } = useMemo(() => {
        const previewLimit = 620;
        const hasMore = text.length > previewLimit;

        // Slice preview text
        const previewText = text.slice(0, previewLimit);

        // Find last newline index
        const lastNewlineIndex = previewText.lastIndexOf("\n");

        // Split into two parts
        const firstPart =
            lastNewlineIndex !== -1 ? previewText.substring(0, lastNewlineIndex) : previewText;
        const lastPart =
            lastNewlineIndex !== -1 ? previewText.substring(lastNewlineIndex + 1) : "";

        return { previewLimit, hasMore, firstPart, lastPart };
    }, [text]);

    return (
        <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} justify-between gap-8`} {...props}>
            {/* Image Section */}
            <div className="relative min-w-full md:min-w-[500px] xl:min-w-[600px] h-[240px] md:h-[320px] xl:h-[360px] rounded-[30px] md:rounded-[40px] lg:rounded-[50px] border-[1.5px] border-[#E0E0E0] p-3 md:p-4">
                <div className="relative w-full h-full rounded-[30px] md:rounded-[40px] lg:rounded-[50px] overflow-hidden">
                    <Image
                        fill
                        src={imageSrc}
                        alt={title}
                        className="object-cover rounded-[30px] md:rounded-[40px] lg:rounded-[50px]"
                    />
                </div>
            </div>

            {/* Text Section */}
            <div className="flex flex-col gap-6 flex-1 max-w-[750px]">
                <h1 className="font-extrabold text-[32px] md:text-[40px] text-primary">{title}</h1>

                {/* Expandable Wrapper */}
                <div
                    className="leading-[140%] relative overflow-hidden transition-all duration-300 ease-in-out"
                >
                    {!hasMore || expanded ? (
                        <span className="text-[#424242] font-medium leading-[140%] whitespace-pre-line">{text}</span>
                    ) : (
                        <p className="font-medium leading-[140%] whitespace-pre-line">
                            <span className="text-[#424242]">{firstPart}</span>
                            {lastPart && "\n"}
                            <span className="text-[#9E9E9E]">
                                {lastPart}
                                {hasMore && " ..."}
                            </span>
                        </p>
                    )}
                </div>

                {hasMore && <button
                    onClick={() => setExpanded(!expanded)}
                    className="border-orange border-[1.5px] px-6 py-2 rounded-[12px] text-orange w-fit font-semibold hover:bg-orange hover:text-white transition-colors duration-300"
                >
                    {expanded ? t("readLess") : t("readMore")}
                </button>}
            </div>
        </div>
    );
}