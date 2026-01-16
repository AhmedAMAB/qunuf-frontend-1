// import Image from "next/image";
// import UsersCard from "./UsersCard";
// import HeroFilter from "./HeroFilter";
// import { useTranslations } from "next-intl";

// export default function HeroSection() {
//     const t = useTranslations("homePage.hero");

//     return (
//         <section
//             id="hero"
//             className="relative overflow-hidden"
//         >
//             <div className="relative pt-[100px] px-4 sm:px-6 lg:px-12 container hero-height">
//                 <Image
//                     src="/financial-center.png"
//                     alt="financial center"
//                     width={950}
//                     height={740}
//                     priority
//                     className="absolute max-h-[calc(100%-200px)] sm:max-h-[calc(100%-300px)]  xl:max-h-[calc(100%-200px)] 2xl:max-h-[calc(100%-100px)] object-contain bottom-0"
//                 />

//                 {/* Content */}
//                 <div className="flex justify-center relative z-10 items-center max-2xl:text-center">
//                     <h1
//                         className="hero-title font-bold text-3xl sm:text-5xl lg:text-6xl xl:text-[75px]
//                leading-tight text-white mt-[40px] md:mt-[70px] lg:mt-[100px] ms-0 mx:ms-[30%]"
//                     >
//                         {t("heading")
//                             .split("\n")
//                             .map((line, i) => (
//                                 <span key={i}>
//                                     {line}
//                                     {i === 0 && <br />}
//                                 </span>
//                             ))}
//                     </h1>
//                 </div>

//                 <HeroFilter />
//                 <UsersCard />
//             </div>
//         </section>
//     );
// }
'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import RatingStars from '@/components/shared/RatingStars';

const users = ['/users/user-1.jpg', '/users/user-2.jpg', '/users/user-3.jpg', '/users/user-4.jpg'];
import { useMemo, useState } from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { CiSearch } from 'react-icons/ci';
import SelectInput, { Option } from '@/components/shared/forms/SelectInput';
import { Link, useRouter } from '@/i18n/navigation';
import { useValues } from '@/contexts/GlobalContext';
import { useLocalizedOptionsGroups } from '@/hooks/useLocalizedOptionsGroups';
import { furnishedValues, propertyTypeValues } from '@/constants/properties/constant';

export default function HeroSection() {
  const t = useTranslations('homePage.hero');
  return (
    <section id="hero" className="relative isolate overflow-hidden min-h-[100svh]">
      {/* Background image + soft overlay (kept subtle to let your brand gradient show) */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/financial-center.png"
          alt="financial center"
          fill
          priority
          sizes="100vw"
          className="object-contain object-right-bottom md:object-right pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/5" />
      </div>

      {/* Centered content stack */}
      <div className="max-w-[1300px] w-full relative mx-auto px-4 sm:px-6 lg:px-12 min-h-[inherit]">
        {/* Make a vertical center column, but reserve space at the bottom so the pinned UsersCard never overlaps */}
        <div className="min-h-[inherit] flex flex-col items-start justify-center pb-28 sm:pb-32 lg:pb-0">
          {/* Eyebrow */}
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
            {t('badge', { default: 'Find your next property' })}
          </span>
          <h1
            className="mt-5 font-bold tracking-tight text-white text-3xl sm:text-5xl lg:text-6xl xl:text-[72px] leading-[1.1]"
          >
            {(t('heading', { default: 'Designing Your\nNext Chapter' }) as string)
              .split('\n')
              .map((line, i) => (
                <span key={i} className="block">
                  {i === 0 ? (
                    <span className="bg-[linear-gradient(150deg,var(--secondary),var(--lightGold),var(--light))] bg-clip-text text-transparent">
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                </span>
              ))}
          </h1>

          {/* Subcopy */}
          <p className="mt-4 max-w-2xl text-white/85 text-base sm:text-lg">
            {
              t('subcopy', {
                default: 'Browse verified listings from trusted agents across Egypt.',
              }) as string
            }
          </p>

          {/* Filter directly under the copy */}
          <div className="mt-8 w-full">
            <HeroFilter />
          </div>
        </div>
      </div>

      {/* Happy clients / Users card
         - On large screens: pinned bottom-end, w-fit
         - On small/tight screens: becomes full-width at the bottom to avoid overlapping */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-6 lg:px-12 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-end">
          {/* lg:w-fit keeps the card compact on desktop; w-full on small to prevent crowding */}
          <div className="w-full max-w-[min(100%,560px)] lg:w-fit">
            <UsersCard />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroFilter() {
  const tFilter = useTranslations("property.filter");
  const t = useTranslations('homePage.filters');
  const router = useRouter();

  const locale = useLocale()
  const { states, loadingStates: loadingLocations } = useValues();
  const locations: Option[] = useMemo(
    () => [
      {
        value: "all",
        label: tFilter("location.any"), // localized "Any location"
      },
      ...states.map((s) => ({
        value: s.id,
        label: locale === "ar" ? s.name_ar : s.name,
      })),
    ],
    [states, locale, t]
  );

  const { propertyTypes, furnishedTypes } = useLocalizedOptionsGroups(
    [
      { key: 'propertyTypes', translationPath: 'propertyType', options: [...propertyTypeValues], },
      { key: 'furnishedTypes', translationPath: 'furnishedType', options: [...furnishedValues], }
    ],
    'property.filter'
  );
  const [selectedLoc, setSelectedLoc] = useState<Option | null>(null);
  const [selectedType, setSelectedType] = useState<Option | null>(null);
  const [selectedFurnished, setSelectedFurnished] = useState<Option | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLoc && selectedLoc.value !== 'all') params.set('location', selectedLoc.value.toString());
    if (selectedType) params.set('type', selectedType.value.toString());
    if (selectedFurnished) params.set('furnished', selectedFurnished.value.toString());

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div
      role="search"
      className="max-w-[1300px] w-full relative z-[45]"
    >
      {/* Match your glass style exactly */}
      <div className="rtl:ml-auto ltr:mr-auto max-w-5xl rounded-2xl border border-white/20 bg-white shadow-xl shadow-slate-900/5 ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/80 p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto] gap-3">
          <SelectInput
            className='!w-full'
            dropdownClassName="!max-h-[250px]"
            options={locations}
            placeholder={t('labels.location')}
            value={selectedLoc}
            onChange={setSelectedLoc}
          />

          <SelectInput
            options={propertyTypes}
            className='!w-full'
            dropdownClassName="!max-h-[250px]"
            placeholder={t('labels.propertyType')}
            value={selectedType}
            onChange={setSelectedType}
          />

          <SelectInput
            options={furnishedTypes}
            className='!w-full'
            dropdownClassName="!max-h-[250px]"
            placeholder={t('labels.category')}
            value={selectedFurnished}
            onChange={setSelectedFurnished}
          />

          <div className="flex items-stretch gap-2">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 sm:px-4 text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              <HiOutlineAdjustmentsHorizontal size={22} />
            </Link>

            <button
              onClick={handleSearch}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 sm:px-6 py-2.5 text-white shadow-sm transition hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-secondary/70 focus:ring-offset-2"
            >
              <span className="text-sm sm:text-base">{t('search')}</span>
              <CiSearch size={22} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
          <span>• {t('helper.noFees', { default: 'No extra fees' })}</span>
          <span>• {t('helper.verified', { default: 'Verified listings' })}</span>
          <span>• {t('helper.instant', { default: 'Instant search' })}</span>
        </div>
      </div>
    </div>
  );
}

export function UsersCard() {
  const rate = 4.5;
  const t = useTranslations("homePage.hero");

  return (
    <div className="w-full lg:w-fit">
      <h2 className="px-2 text-left rtl:text-right w-full text-white font-semibold text-xl sm:text-2xl lg:text-3xl mb-3">
        {t("clients", { count: "50K" })}
      </h2>

      <div className="bg-white/95 backdrop-blur rounded-[20px_0_0_0] rtl:rounded-[0_20px_0_0] border border-white/10 shadow-lg px-3 py-3 sm:px-4 sm:py-4 flex flex-col-reverse sm:flex-row items-center sm:items-end gap-2 sm:gap-6">
        {/* Rating block */}
        <div className="flex flex-row-reverse sm:flex-col gap-2 justify-center text-center sm:text-end">
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-[color:var(--secondary)]">{rate}/5</p>
          <RatingStars rating={rate} />
          <p className="mt-1 text-[11px] text-slate-500">{t("ratingLabel", { default: "Average rating" })}</p>
        </div>

        {/* Avatars (overlapped, RTL-safe) */}
        <div className="flex flex-row-reverse">
          {users.map((src, i) => (
            <div
              key={i}
              className="w-12 h-12 sm:w-[60px] sm:h-[58px] md:w-[72px] md:h-[70px] rounded-full overflow-hidden border-2 border-white transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              // logical spacing so it works in LTR/RTL
              style={{ marginInlineEnd: i === 0 ? 0 : -24, zIndex: i + 1 }}
            >
              <Image
                src={src}
                alt={`User ${i + 1}`}
                width={72}
                height={70}
                className="w-full h-full object-cover"
                sizes="(max-width: 640px) 48px, (max-width: 768px) 60px, 72px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}