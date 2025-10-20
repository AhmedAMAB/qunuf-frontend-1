'use client';

import { useTranslations } from 'next-intl';
import AboutCard from './AboutCard';
import SectionHeading from '../../SectionHeading';

const cardBlocks = [
  {
    key: 'vision',
    imageUrl: '/about/vision.jpg',
    description:
      'Lorem ipsum was conceived as filler text, formatted in a certain way to enable the presentation of graphic elements in documents, without the need for formal copy. Lorem ipsum was conceived as filler text, formatted in a certain way to enable the presentation of graphic',
  },
  {
    key: 'goals',
    imageUrl: '/about/goals.jpg',
    description:
      'Lorem ipsum was conceived as filler text, formatted in a certain way to enable the presentation of graphic elements in documents, without the need for formal copy. Lorem ipsum was conceived as filler text, formatted in a certain way to enable the presentation of graphic',
  },
  {
    key: 'missions',
    imageUrl: '/about/mission.jpg',
    description:
      'Lorem ipsum was conceived as filler text, formatted in a certain way to enable the presentation of graphic elements in documents, without the need for formal copy. Lorem ipsum was conceived as filler text, formatted in a certain way to enable the presentation of graphic',
  },
];

export default function LargeCardSection() {
  const t = useTranslations('dashboard.admin.about');
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <SectionHeading title={t('title')} />

      </div>
      {cardBlocks.map((block) => (
        <AboutCard key={block.key} block={block} />
      ))}
    </div>
  );
}
