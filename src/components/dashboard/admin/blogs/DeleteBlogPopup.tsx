'use client';

import ActionPopup from "@/components/shared/ActionPopup";
import api from "@/libs/axios";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaBuilding, FaRegNewspaper } from "react-icons/fa";

interface DeleteBlogPopupProps {
    onClose: () => void;
    onSuccess: () => void;
    selectedBlog: {
        id: string;
        name: string;
    };
}

export default function DeleteBlogPopup({
    onClose,
    onSuccess,
    selectedBlog
}: DeleteBlogPopupProps) {

    const t = useTranslations('dashboard.admin.blog');
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        const toastId = toast.loading(
            t('delete.deleting', { name: selectedBlog.name })
        );
        setDeleting(true);

        try {
            await api.delete(`/blogs/${selectedBlog.id}`);

            toast.success(
                t('delete.success', { name: selectedBlog.name }),
                { id: toastId }
            );

            onClose();
            onSuccess();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message ||
                t('delete.error', { name: selectedBlog.name }),
                { id: toastId }
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <ActionPopup
            title={t('delete.title')}
            subtitle={t.rich('delete.subtitle', {
                name: selectedBlog.name,
                strong: (chunk) => <strong>{chunk}</strong>,
            })}
            MainIcon={FaRegNewspaper}
            mainIconColor="#FD5257"
            cancelText={t('delete.cancel')}
            actionText={t('delete.actionText')}
            onCancel={onClose}
            onAction={handleDelete}
            isDisabled={deleting}
        />
    );
}
