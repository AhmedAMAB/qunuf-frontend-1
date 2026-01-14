'use client';

import { FileItem, resolveUrl } from "@/utils/upload";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";
import { FaFilePdf, FaFileExcel, FaFileWord, FaFileCsv, FaFileArchive, FaFileAlt } from "react-icons/fa";


// خريطة الامتداد → أيقونة + لون
const fileTypeMap: Record<string, { icon: any; color: string }> = {
    pdf: { icon: FaFilePdf, color: "text-red-500" },
    csv: { icon: FaFileCsv, color: "text-green-500" },
    xls: { icon: FaFileExcel, color: "text-green-600" },
    xlsx: { icon: FaFileExcel, color: "text-green-600" },
    doc: { icon: FaFileWord, color: "text-blue-600" },
    docx: { icon: FaFileWord, color: "text-blue-600" },
    zip: { icon: FaFileArchive, color: "text-yellow-600" },
    rar: { icon: FaFileArchive, color: "text-yellow-600" },
    "7z": { icon: FaFileArchive, color: "text-yellow-600" },
    default: { icon: FaFileAlt, color: "text-gray-500" },
};

type FilePreviewItemProps = {
    file: FileItem | string;
    idx: number;
    allowMultiple?: boolean;
    allowPrimary?: boolean;
    setPrimary?: (url: string) => void;
    removeFile?: (url: string) => void;
    canRemove?: boolean;
    removingFiles: Set<string>
};

export default function FilePreviewItem({
    removingFiles,
    file,
    idx,
    allowMultiple = true,
    allowPrimary = true,
    setPrimary,
    removeFile,
    canRemove
}: FilePreviewItemProps) {
    // Support edit mode: backend may return just a URL string
    const t = useTranslations("comman.form.uploader");

    const fileObj: FileItem =
        typeof file === "string"
            ? { url: file, name: file.split("/").pop(), type: "", isPrimary: idx === 0 }
            : file;

    const isImage =
        fileObj.type?.startsWith("image/") ||
        /\.(jpg|jpeg|png|gif|webp)$/i.test(fileObj.url);

    const fileName = fileObj.name || `file-${idx}`;
    const ext = fileName.split(".").pop()?.toLowerCase() || "default";

    const { icon: FileIcon, color } = fileTypeMap[ext] || fileTypeMap.default;

    const isRemoving = useMemo(() => {
        return removingFiles.has(fileObj.url);
    }, [removingFiles, fileObj.url]);

    return (
        <div key={idx} className="relative group overflow-hidden rounded-lg">
            {/* Main Content Area */}
            <div className={`${isRemoving ? "opacity-40 grayscale" : "opacity-100"} transition-all duration-300`}>
                {isImage ? (
                    <Image
                        src={resolveUrl(fileObj.url)}
                        alt={fileName}
                        height={160}
                        width={160}
                        className={`w-full h-40 object-cover rounded-lg border ${allowPrimary && fileObj.isPrimary ? "border-4 border-primary" : ""}`}
                    />
                ) : (
                    <div className={`w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-lg border ${allowPrimary && fileObj.isPrimary ? "border-4 border-primary" : ""}`}>
                        <FileIcon className={`w-12 h-12 mb-2 ${color}`} />
                        <span className="text-sm font-medium text-primary-600 truncate px-2 w-full text-center">{fileName}</span>
                    </div>
                )}
            </div>

            {/* 2. Loading Overlay / Skeleton */}
            {isRemoving && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary animate-pulse">
                        {t("removing") || "Removing..."}
                    </span>
                </div>
            )}

            {/* Primary Action Button */}
            {allowMultiple && allowPrimary && setPrimary && !isRemoving && (
                <button
                    type="button"
                    disabled={isRemoving}
                    onClick={() => setPrimary(fileObj.url)}
                    className="absolute bottom-2 left-2 bg-white/80 text-xs px-2 py-1 rounded shadow hover:bg-white transition-colors"
                >
                    {fileObj.isPrimary ? t("primaryFile") : t("setAsPrimary")}
                </button>
            )}

            {/* 3. Remove Button (Disabled during removal) */}
            {removeFile && canRemove && (
                <button
                    type="button"
                    disabled={isRemoving} // Disable while removing
                    onClick={() => removeFile(fileObj.url)}
                    className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded shadow transition-all
                        ${isRemoving ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
                >
                    {isRemoving ? "..." : "✕"}
                </button>
            )}
        </div>
    );
}
