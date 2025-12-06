'use client';

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { resolveUrl } from "@/utils/upload";
import { getInitials } from "@/utils/helpers";

interface DepartmentCardProps {
    title_en: string;
    title_ar: string;
    description_en?: string | null;
    description_ar?: string | null;
    imagePath?: string | null;
    onEdit: () => void;
    onDelete: () => void;
}

export default function DepartmentCard({
    title_en,
    title_ar,
    description_en,
    description_ar,
    imagePath,
    onEdit,
    onDelete
}: DepartmentCardProps) {

    const t = useTranslations("dashboard.admin.departments");
    const locale = useLocale();
    const isArabic = locale === "ar";

    const title = isArabic ? title_ar : title_en;
    const description = (isArabic ? description_ar : description_en) || "";

    return (
        <div
            className="
                relative bg-card-bg rounded-[8px] p-4 
                flex flex-col gap-6 w-full 
                custom-shadow border border-gray-100
            "
        >
            {/* Edit Button */}
            <button
                onClick={onEdit}
                className="
                    flex-center absolute top-2 end-2
                    bg-white p-2 rounded-full shadow-md hover:bg-gray-100 z-10
                "
            >
                <FaEdit size={18} className="text-dark" />
            </button>

            {/* Delete Button */}
            <button
                onClick={onDelete}
                className="
                    flex-center absolute top-2 start-2 
                    bg-red-600 p-2 rounded-full shadow-md hover:bg-red-700 z-10
                "
            >
                <MdDelete size={18} className="text-white" />
            </button>

            {/* Image Section */}
            <div className="relative w-full h-[200px] md:h-[240px] lg:h-[260px] rounded-[4px] overflow-hidden">

                {imagePath ? (
                    <Image
                        src={resolveUrl(imagePath)}
                        alt={title}
                        fill
                        className="object-cover rounded-[4px] opacity-95 mix-blend-multiply"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-3xl">
                        {getInitials(title)}
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-[4px]" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-dark">
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className="
                    font-inter text-[15px] leading-[28px] text-[#363636] 
                    text-justify
                ">
                    {description}
                </p>
            )}
        </div>
    );
}
