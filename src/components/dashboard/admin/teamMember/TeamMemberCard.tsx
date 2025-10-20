'use client';

import { FaPhone, FaEnvelope, FaTrashAlt, FaEdit, FaUser } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Popup from '@/components/shared/Popup';
import ActionPopup from '@/components/shared/ActionPopup';
import { MdDelete } from 'react-icons/md';
import TeamMemberForm from './TeamMemberForm';

interface TeamMemberCardProps {
  name: string;
  phone: string;
  email: string;
  imageUrl: string;
}

export function TeamMemberCard({ name, phone, email, imageUrl }: TeamMemberCardProps) {
  const t = useTranslations('dashboard.admin.team');
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="relative bg-lighter rounded-[14px] p-4 w-full max-w-xs mx-auto flex flex-col items-center gap-4 pb-6 md:pb-10">
        {/* Edit Icon */}
        <button
          onClick={() => setShowEdit(true)}
          className="flex-center absolute top-2 end-2 bg-light p-2 rounded-full custom-shadow"
        >
          <FaEdit size={20} className="text-dark" />
        </button>

        <button
          onClick={() => setShowDelete(true)}
          className="flex-center bg-red-500 absolute top-2 start-2  p-2 rounded-full custom-shadow"
        >
          <MdDelete size={20} className="text-white " />
        </button>

        {/* Profile Image */}
        <div className="rounded-[12px] overflow-hidden w-[111px] h-[105px]">
          <Image
            src={imageUrl}
            alt={name}
            width={111}
            height={105}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 w-full">
          <div className="bg-secondary shrink-0 rounded-[12px] w-9 h-9 flex items-center justify-center text-white">
            <FaPhone size={16} />
          </div>
          <span className="text-dark" dir='ltr'>{phone}</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 w-full">
          <div className="bg-secondary shrink-0 rounded-[12px] w-9 h-9 flex items-center justify-center text-white">
            <FaEnvelope size={16} />
          </div>
          <span className="text-dark">{email}</span>
        </div>


      </div>

      {/* Delete Popup */}
      <Popup show={showDelete} onClose={() => setShowDelete(false)} headerContent={t('deleteTitle')}>
        <DeleteTeamMemberPopup onClose={() => setShowDelete(false)} />
      </Popup>

      {/* Edit Popup */}
      <Popup show={showEdit} onClose={() => setShowEdit(false)} className='max-sm:!w-full' headerContent={<p className="text-[24px] font-bold text-dark">{t('edit')}</p>}>
        <TeamMemberForm
          initialData={{ name, phone, email, imageUrl }}
          onCancel={() => setShowEdit(false)}
          onAction={(data) => {
            console.log('Edit:', data);
            setShowEdit(false);
          }}
          cancelText={t('cancel')}
          actionText={t('editAction')}
        />
      </Popup>

    </>
  );
}


interface DeleteTeamMemberPopupProps {
  onClose: () => void;
}

export default function DeleteTeamMemberPopup({ onClose }: DeleteTeamMemberPopupProps) {
  const t = useTranslations('dashboard.admin.team');

  return (
    <ActionPopup
      title={t('delete.title')}
      subtitle={t('delete.subtitle')}
      MainIcon={FaUser}
      mainIconColor="#FD5257"
      cancelText={t('delete.cancel')}
      actionText={t('delete.actionText')}
      onCancel={onClose}
      onAction={() => onClose()}
    />
  );
}