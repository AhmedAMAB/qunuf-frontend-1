'use client';

import { FileItem, processFiles, resolveUrl } from '@/utils/upload';
import { Control, Controller } from 'react-hook-form';
import FilePreviewItem from './FilePreviewItem';
import { BsCloudArrowUp } from 'react-icons/bs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { set } from 'zod';
import { MdClose } from 'react-icons/md';

type UploaderProps = {
    control: Control<any>;
    name: string; // 👈 field name
    allowMultiple?: boolean;
    allowPrimary?: boolean
    label?: string;
    onRemoveFile?: (file: FileItem) => Promise<boolean>,
    preventRemoveOn?: number;
    accept?: string;
    rules?: string[]; // 👈 array of rules to display
    maxSizeMB?: number;
    maxFiles?: number;
    defaultImage?: string;
};

export default function Uploader({
    control,
    name,
    allowMultiple = true,
    allowPrimary = true,
    label,
    defaultImage,
    onRemoveFile,
    preventRemoveOn,
    accept = '*/*',
    rules = ['الحد الأقصى لحجم الملف 9MB', 'الحد الأقصى 10 ملفات'],
    maxSizeMB = 9,
    maxFiles = 10,
}: UploaderProps) {
    const t = useTranslations("comman.form.uploader");
    const [removingFiles, setRemovingFiles] = useState(new Set<string>());
    // generate a stable unique id per Uploader instance
    const idRef = useRef(`${name}-dropzone-${Math.random().toString(36).slice(2)}`);
    const inputId = idRef.current;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const currentFiles: FileItem[] = Array.isArray(field.value)
                    ? field.value
                    : field.value
                        ? [field.value]
                        : [];

                const canRemove = !preventRemoveOn || currentFiles.length > preventRemoveOn;
                const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.files) return;

                    const files = Array.from(e.target.files);

                    const updated = processFiles(
                        files,
                        accept,
                        allowMultiple,
                        allowPrimary,
                        field.value || [],
                        maxSizeMB,
                        maxFiles
                    );

                    field.onChange(allowMultiple ? updated : updated[0]);
                };


                const setPrimary = (url: string) => {
                    const updated = (field.value || []).map((f: FileItem) => ({
                        ...f,
                        isPrimary: f.url === url,
                    }));
                    field.onChange(updated);
                };

                const removeFile = async (url: string) => {
                    const currentValues = Array.isArray(field.value)
                        ? field.value
                        : field.value ? [field.value] : [];

                    // 2. Find the specific file item to pass to the callback
                    const fileItemToRemove = currentValues.find((f: any) =>
                        typeof f === 'string' ? f === url : f.url === url
                    );

                    let isRemoved = true;
                    if (onRemoveFile) {
                        setRemovingFiles(prev => {
                            const next = new Set(prev);
                            next.add(fileItemToRemove.url);
                            return next;
                        });

                        isRemoved = await onRemoveFile(fileItemToRemove);

                        setRemovingFiles(prev => {
                            const next = new Set(prev);
                            next.delete(fileItemToRemove.url);
                            return next;
                        });
                    }


                    if (!isRemoved) return;
                    let updated = currentValues.filter((f: any) =>
                        typeof f === 'string' ? f !== url : f.url !== url
                    );

                    if (allowMultiple && allowPrimary && updated.length > 0) {
                        const hasPrimary = updated.some((f: any) => typeof f === 'object' && f.isPrimary);

                        if (!hasPrimary && typeof updated[0] === 'object') {
                            updated[0] = { ...updated[0], isPrimary: true };
                        }
                    }

                    const finalValue = allowMultiple ? updated : (updated[0] || null);
                    field.onChange(finalValue);
                };

                const isOneFile = !allowMultiple;

                return (
                    <div className="col-span-12"
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = Array.from(e.dataTransfer.files);
                            handleFiles({ target: { files } } as any); // 👈 reuse your handleFiles
                        }}
                        onDragOver={(e) => e.preventDefault()}>
                        {/* Label */}
                        {label && <label htmlFor={inputId} className="text-xl font-medium block mb-3">
                            {label}
                        </label>}

                        {/* Dropzone */}
                        <div className="relative overflow-hidden flex items-center justify-center border-dashed border-gray-400 rounded-[8px] w-full">
                            <label
                                htmlFor={inputId}
                                className="relative  flex flex-col items-center justify-center w-full cursor-pointer  border-gray-400 rounded-[8px] border border-dashed"
                            >
                                <span className="flex flex-col items-center justify-center py-6">
                                    <BsCloudArrowUp size={60} />
                                    <span className="h3 clr-neutral-500 text-center mt-4 mb-3">
                                        {t("dragLabel")}
                                    </span>
                                    <span className="block text-center mb-6 clr-neutral-500">
                                        {t("orLabel")}
                                    </span>
                                    <span className="inline-block px-6 text-[#354764] mb-10">
                                        {t("chooseFiles")}
                                    </span>

                                    <span className="flex items-center justify-center flex-wrap gap-5 text-sm text-gray-500">
                                        {rules.map((rule, i) => (
                                            <span key={i}>{rule}</span>
                                        ))}
                                    </span>
                                </span>
                                <input
                                    id={inputId}
                                    type="file"
                                    multiple={allowMultiple}
                                    accept={accept}
                                    className="hidden"
                                    onChange={handleFiles}
                                />
                                {isOneFile && currentFiles.length === 1 && (() => {
                                    const file = currentFiles[0];
                                    let src = '';
                                    let isImage = false;

                                    let fileName = '';

                                    if (typeof file === 'string') {
                                        src = file;
                                        isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(src);
                                        fileName = src.split('/').pop() || '';
                                    } else {
                                        src = file.url || '';
                                        isImage = file.type?.startsWith('image/');
                                        fileName = file.name || '';
                                    }
                                    if (!src) return null;
                                    const isRemoving = removingFiles.has(src);
                                    return (
                                        <div className="absolute inset-0 z-20 bg-white">
                                            <div className={`relative w-full h-full ${isRemoving ? "opacity-50 grayscale" : ""}`}>
                                                {isImage ? (
                                                    <Image
                                                        src={resolveUrl(src)}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover rounded-[8px]"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 rounded-[8px] flex flex-col items-center justify-center">
                                                        <BsCloudArrowUp size={40} className="text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-700 px-4 text-center truncate w-full">{fileName}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Loading Spinner for Single File */}
                                            {isRemoving && (
                                                <div className="absolute inset-0 flex items-center justify-center z-30">
                                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}

                                            {/* Close Icon - Disabled while removing */}
                                            <button
                                                type="button"
                                                disabled={isRemoving}
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent opening file dialog
                                                    e.stopPropagation();
                                                    removeFile(src); // Your callback
                                                }}
                                                className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md z-40 transition-colors
                    ${isRemoving ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
                                            >
                                                <MdClose size={18} />
                                            </button>
                                        </div>
                                    );
                                })()}

                            </label>
                        </div>

                        {!isOneFile && currentFiles.length > 0 && (
                            <div className="grid grid-cols-1 xs:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-4 mt-6">
                                {currentFiles.map((file: FileItem | string, idx: number) => (
                                    <FilePreviewItem
                                        canRemove={canRemove}
                                        removingFiles={removingFiles}
                                        key={idx}
                                        file={file}
                                        idx={idx}
                                        allowMultiple={allowMultiple}
                                        allowPrimary={allowPrimary}
                                        setPrimary={setPrimary}
                                        removeFile={removeFile}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                );
            }}
        />
    );
}
