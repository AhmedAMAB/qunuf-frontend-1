'use client';

import { FileItem } from "@/utils/upload";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
};

export default function FilePreviewItem({
    file,
    idx,
    allowMultiple = true,
    allowPrimary = true,
    setPrimary,
    removeFile,
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

    return (
        <div key={idx} className="relative group">
            {isImage ? (
                <Image
                    src={fileObj.url}
                    alt={fileName}
                    height={160}
                    width={160}
                    className={`w-full h-40 object-cover rounded-lg border ${allowPrimary && fileObj.isPrimary ? "border-4 border-primary" : ""}`}
                />
            ) : (
                <div
                    className={`w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-lg border ${allowPrimary && fileObj.isPrimary ? "border-4 border-primary" : ""}`}
                >
                    <FileIcon className={`w-12 h-12 mb-2 ${color}`} />
                    <a
                        href={fileObj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        <span className="text-sm font-medium text-primary-600">{fileName}</span>
                    </a>

                    <span className="text-xs text-gray-500">{ext?.toUpperCase()}</span>
                </div>
            )}

            {allowMultiple && allowPrimary && setPrimary && (
                <button
                    type="button"
                    onClick={() => setPrimary(fileObj.url)}
                    className="absolute bottom-2 left-2 bg-white/80 text-xs px-2 py-1 rounded shadow hover:bg-white"
                >
                    {fileObj.isPrimary ? t("primaryFile") : t("setAsPrimary")}
                </button>
            )}

            {removeFile && <button
                type="button"
                onClick={() => removeFile(fileObj.url)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600"
            >
                ✕
            </button>}
        </div>
    );
}
