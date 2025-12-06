'use client';

import { FaPhone, FaEnvelope, FaEdit } from 'react-icons/fa';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { MdDelete } from 'react-icons/md';
import { resolveUrl } from '@/utils/upload';
import { getInitials } from '@/utils/helpers';
import ImageAlt from '@/components/shared/ImageAlt';

interface TeamMemberCardProps {
  name: string;
  job: string;
  phone: string;
  email: string;
  imagePath: string;
  description_en?: string | null;
  description_ar?: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function TeamMemberCard({
  name,
  job,
  phone,
  email,
  imagePath,
  description_en,
  description_ar,
  onEdit,
  onDelete
}: TeamMemberCardProps) {
  const t = useTranslations("dashboard.admin.team");

  const locale = useLocale();
  const isArabic = locale === 'ar';
  const description = (isArabic ? description_ar : description_en) || '';
  return (
    <div className="relative bg-card-bg rounded-[14px] p-4 w-full max-w-xs mx-auto flex flex-col items-center gap-4 pb-6 md:pb-10">
      {/* Edit Icon */}
      <button
        onClick={() => onEdit()}
        className="flex-center absolute top-2 end-2 bg-light p-2 rounded-full custom-shadow"
      >
        <FaEdit size={20} className="text-dark" />
      </button>

      <button
        onClick={() => onDelete()}
        className="flex-center bg-red-500 absolute top-2 start-2 p-2 rounded-full custom-shadow"
      >
        <MdDelete size={20} className="text-white" />
      </button>

      {/* Profile Image */}
      <div className="rounded-[12px] overflow-hidden w-[111px] h-[105px]">
        {imagePath ? (
          <Image
            src={resolveUrl(imagePath)}
            alt={name}
            width={111}
            height={105}
            className="object-cover w-full h-full"
          />
        ) : (
          <ImageAlt title={name} />
        )}
      </div>

      {/* Name */}
      <div className='space-y-2'>

        <h3 className="text-dark font-semibold text-base text-center">{name}</h3>
        {/* Job */}
        <p className="text-sm text-gray-dark text-center">{job}</p>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3 w-full">
        <div className="bg-secondary shrink-0 rounded-[12px] w-9 h-9 flex items-center justify-center text-white">
          <FaPhone size={16} />
        </div>
        <span className="text-dark" dir="ltr">
          {phone}
        </span>
      </div>

      {/* Email */}
      <div className="flex items-center gap-3 w-full">
        <div className="bg-secondary shrink-0 rounded-[12px] w-9 h-9 flex items-center justify-center text-white">
          <FaEnvelope size={16} />
        </div>
        <span className="text-dark">{email}</span>
      </div>

      {/* Optional Description */}
      {description && (
        <p className="text-sm text-gray-600 text-center mt-2">
          {description}
        </p>
      )}


      {/* Delete Popup */}


    </div>
  );
}

