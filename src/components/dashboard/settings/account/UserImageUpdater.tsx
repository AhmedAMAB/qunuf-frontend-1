import { useAuth } from "@/contexts/AuthContext";
import api from "@/libs/axios";
import { resolveUrl } from "@/utils/upload";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function UserImageUpdater() {
    const t = useTranslations('dashboard.account');
    const [imageUploading, setImageUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, setCurrentUser } = useAuth();
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation (optional: check size or type here if needed)
        if (!file.type.startsWith('image/')) {
            toast.error(t('messages.invalidFileType'));
            return;
        }

        const formData = new FormData();
        formData.append('image', file); // The backend expects a field named 'image'

        setImageUploading(true);
        const toastId = toast.loading(t('messages.uploadingImage'));

        try {

            const res = await api.post('/users/profile-image', formData);

            toast.success(t('messages.imageUpdated'), { id: toastId });

            setCurrentUser(({ ...user, imagePath: res.data.imagePath }));
        } catch (error: any) {
            const errorMsg = t('messages.updateError');
            toast.error(errorMsg, { id: toastId });
        } finally {
            setImageUploading(false);
            // Reset input so the same file can be picked again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };


    return (
        <div className="flex flex-col items-center pb-6 border-b border-gray-100 mb-6">
            <div className="relative mb-4 group">
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                />

                {/* Image Container */}
                <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-gray-50">
                    {user?.imagePath ? (
                        <Image
                            src={resolveUrl(user.imagePath) || "/users/default-user.png"}
                            alt={user.name}
                            fill
                            className={`object-cover transition-opacity duration-300 ${imageUploading ? 'opacity-50' : 'opacity-100'}`}
                            sizes="(max-width: 640px) 96px, 128px"
                            priority
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-medium">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    )}
                    {/* Loading Spinner Overlay */}
                    {imageUploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="animate-spin h-8 w-8 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </div>

                {/* Edit Icon Button - Triggers file input click */}
                <button
                    type="button"
                    onClick={() => !imageUploading && fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 bg-white p-2 rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-secondary transition-colors z-10"
                    title={t('changeImage')}
                >
                    {/* Simple Pencil / Edit SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                    </svg>
                </button>
            </div>

            {/* User Data Display */}
            <h2 className="text-xl font-semibold text-dark">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
        </div>
    );
}