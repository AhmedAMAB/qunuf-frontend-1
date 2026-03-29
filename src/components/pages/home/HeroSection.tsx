'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import RatingStars from '@/components/atoms/RatingStars';
import { useMemo, useState } from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { CiSearch } from 'react-icons/ci';
import SelectInput, { Option } from '@/components/molecules/forms/SelectInput';
import { Link, useRouter } from '@/i18n/navigation';
import { useValues } from '@/contexts/GlobalContext';
import { useLocalizedOptionsGroups } from '@/hooks/useLocalizedOptionsGroups';
import { furnishedValues, propertyTypeValues } from '@/constants/properties/constant';

/* ─── Constants ─────────────────────────────────────────────────────────── */
const AVATAR_SRCS = [
	'/users/user-1.jpg',
	'/users/user-2.jpg',
	'/users/user-3.jpg',
	'/users/user-4.jpg',
] as const;

const RATING = 4.5;

/* ═══════════════════════════════════════════════════════════════════════════
	 HERO SECTION
═══════════════════════════════════════════════════════════════════════════ */
export default function HeroSection() {
	const t = useTranslations('homePage.hero');

	return (
		<section
			id="hero"
			aria-label={t('sectionLabel')}
			className="relative isolate overflow-hidden min-h-[100svh] flex flex-col"
		>
			{/* ── Background stack ─────────────────────────────────────────── */}
			<div
				className="absolute inset-0 -z-10 pointer-events-none select-none"
				aria-hidden="true"
			>
				{/* Hero image */}
				<Image
					src="/financial-center.png"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center sm:object-right-bottom"
				/>

				{/* Cinematic dark vignette — top-heavy so headline pops */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/20" />

				{/* LTR: dark left edge  |  RTL: dark right edge — pushes eye to content side */}
				<div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-black/55 via-black/20 to-transparent" />

				{/* Warm-gold brand glow at bottom */}
				<div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[color:var(--secondary)]/15 via-transparent to-transparent" />

				{/* Subtle vignette corners */}
				<div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.35)]" />
			</div>

			{/* ── Content wrapper ──────────────────────────────────────────── */}
			<div className="relative flex-1 flex flex-col mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-14">

				<div className="flex-1 flex flex-col justify-center items-start pt-28 pb-52 sm:pb-56 lg:pb-44">
					<HeroCopy />
					<div className="mt-9 w-full">
						<HeroFilter />
					</div>
				</div>

			</div>
				<div
					className="
            absolute inset-x-0
            bottom-0
            flex justify-end            pb-[env(safe-area-inset-bottom)]
          "
				>
					<UsersCard />
				</div>
		</section>
	);
}

/* ═══════════════════════════════════════════════════════════════════════════
	 HERO COPY  (badge + headline + subcopy)
═══════════════════════════════════════════════════════════════════════════ */
function HeroCopy() {
	const t = useTranslations('homePage.hero');

	return (
		<>
			{/* Eyebrow badge */}
			<span className="
        inline-flex items-center gap-2
        rounded-full
        border border-white/20 bg-white/10
        px-4 py-1.5
        text-[11px] sm:text-xs font-semibold tracking-widest uppercase
        text-white/85 backdrop-blur-md
      ">
				<span
					className="block w-1.5 h-1.5 rounded-full bg-[color:var(--lightGold)] animate-pulse"
					aria-hidden="true"
				/>
				{t('badge')}
			</span>

			{/* Headline */}
			<h1 className="
        mt-5
        font-black tracking-tighter
        text-[clamp(2.1rem,5.5vw,4.25rem)]
        leading-[1.06]
        max-w-[16ch]
        text-white
      ">
				{(t('heading') as string).split('\n').map((line, i) =>
					i === 0 ? (
						<span key={i} className="block bg-[linear-gradient(130deg,var(--secondary)_0%,var(--lightGold)_55%,#fff_100%)] bg-clip-text text-transparent">
							{line}
						</span>
					) : (
						<span key={i} className="block">{line}</span>
					)
				)}
			</h1>

			{/* Subcopy */}
			<p className="
        mt-4 max-w-[52ch]
        text-sm sm:text-[15px] leading-[1.75]
        text-white/65 font-light
      ">
				{t('subcopy') as string}
			</p>
		</>
	);
}

/* ═══════════════════════════════════════════════════════════════════════════
	 HERO FILTER
═══════════════════════════════════════════════════════════════════════════ */
export function HeroFilter() {
	const tFilter = useTranslations('property.filter');
	const t = useTranslations('homePage.filters');
	const router = useRouter();
	const locale = useLocale();

	const { states } = useValues();

	/* Location options */
	const locations: Option[] = useMemo(
		() => [
			{ value: 'all', label: tFilter('location.any') },
			...states.map((s) => ({
				value: s.id,
				label: locale === 'ar' ? s.name_ar : s.name,
			})),
		],
		[states, locale, tFilter]
	);

	/* Type + furnished options */
	const { propertyTypes, furnishedTypes } = useLocalizedOptionsGroups(
		[
			{ key: 'propertyTypes', translationPath: 'propertyType', options: [...propertyTypeValues] },
			{ key: 'furnishedTypes', translationPath: 'furnishedType', options: [...furnishedValues] },
		],
		'property.filter'
	);

	const [selectedLoc, setSelectedLoc] = useState<Option | null>(null);
	const [selectedType, setSelectedType] = useState<Option | null>(null);
	const [selectedFurnished, setSelectedFurnished] = useState<Option | null>(null);

	/* Navigate to /properties with query params */
	const handleSearch = () => {
		const params = new URLSearchParams();
		if (selectedLoc && selectedLoc.value !== 'all')
			params.set('location', selectedLoc.value.toString());
		if (selectedType)
			params.set('type', selectedType.value.toString());
		if (selectedFurnished)
			params.set('furnished', selectedFurnished.value.toString());
		router.push(`/properties?${params.toString()}`);
	};

	return (
		<div
			role="search"
			aria-label={t('ariaLabel')}
			className="w-full max-w-4xl"
		>
			{/* Glass filter card */}
			<div className="
        rounded-2xl
        border border-white/20
        bg-white/97 dark:bg-neutral-900/95
        shadow-[0_8px_40px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.1)]
        ring-1 ring-black/[0.04]
        backdrop-blur-xl
        p-3 sm:p-3.5
      ">

				{/* Selects + actions grid */}
				<div className="
          grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]
          gap-2 sm:gap-2.5
        ">
					<SelectInput
						className="!w-full"
						dropdownClassName="!max-h-[260px]"
						options={locations}
						placeholder={t('labels.location')}
						value={selectedLoc}
						onChange={setSelectedLoc}
					/>

					<SelectInput
						className="!w-full"
						dropdownClassName="!max-h-[260px]"
						options={propertyTypes}
						placeholder={t('labels.propertyType')}
						value={selectedType}
						onChange={setSelectedType}
					/>

					<SelectInput
						className="!w-full"
						dropdownClassName="!max-h-[260px]"
						options={furnishedTypes}
						placeholder={t('labels.category')}
						value={selectedFurnished}
						onChange={setSelectedFurnished}
					/>

					{/* CTA area */}
					<div className="flex items-stretch gap-2">

						{/* Advanced-filters icon button */}
						<Link
							href="/properties"
							aria-label={t('advancedFilters')}
							className="
                inline-flex items-center justify-center
                min-h-[48px] min-w-[48px]
                rounded-xl
                border border-slate-200 bg-white
                text-slate-500
                hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-[color:var(--secondary)]/50 focus:ring-offset-1
                transition-all duration-150
              "
						>
							<HiOutlineAdjustmentsHorizontal size={20} aria-hidden="true" />
						</Link>

						{/* Primary search button */}
						<button
							onClick={handleSearch}
							className="
                group
                inline-flex flex-1 items-center justify-center gap-2
                min-h-[48px]
                rounded-xl
                bg-[color:var(--secondary)]
                px-5 sm:px-7
                text-white text-sm sm:text-[15px] font-semibold
                shadow-lg shadow-[color:var(--secondary)]/30
                hover:brightness-105 hover:shadow-xl hover:shadow-[color:var(--secondary)]/35
                active:scale-[0.97]
                focus:outline-none focus:ring-2 focus:ring-[color:var(--secondary)]/60 focus:ring-offset-2
                transition-all duration-150
                whitespace-nowrap
              "
						>
							{t('search')}
							<CiSearch
								size={20}
								aria-hidden="true"
								className="
                  ltr:group-hover:translate-x-0.5
                  rtl:group-hover:-translate-x-0.5
                  transition-transform duration-200
                "
							/>
						</button>
					</div>
				</div>

				{/* Trust signals strip */}
				<div className="
          mt-3 pt-3
          border-t border-slate-100
          flex flex-wrap items-center justify-center
          gap-x-5 gap-y-1.5
          text-[11px] text-slate-400 font-medium tracking-wide
        ">
					{[
						{ color: 'bg-emerald-400', key: 'helper.noFees' },
						{ color: 'bg-sky-400', key: 'helper.verified' },
						{ color: 'bg-violet-400', key: 'helper.instant' },
					].map(({ color, key }) => (
						<span key={key} className="flex items-center gap-1.5">
							<span className={`block w-1.5 h-1.5 rounded-full ${color}`} aria-hidden="true" />
							{t(key as any)}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

/* ═══════════════════════════════════════════════════════════════════════════
	 USERS CARD
═══════════════════════════════════════════════════════════════════════════ */
export function UsersCard() {
	const t = useTranslations('homePage.hero');

	return (
		<div className="w-full sm:w-auto">
 

			{/* Card — docked to the bottom edge, open corner toward content */}
			<div className="
        ltr:rounded-tl-2xl ltr:rounded-tr-2xl ltr:rounded-br-none ltr:rounded-bl-none
        rtl:rounded-tl-2xl rtl:rounded-tr-2xl rtl:rounded-bl-none rtl:rounded-br-none
        sm:ltr:rounded-tl-2xl sm:ltr:rounded-tr-none sm:ltr:rounded-br-none sm:ltr:rounded-bl-none
        sm:rtl:rounded-tr-2xl sm:rtl:rounded-tl-none sm:rtl:rounded-bl-none sm:rtl:rounded-br-none
        bg-white/90 backdrop-blur-xl
        border border-white/15
        shadow-[0_-4px_32px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.08)]
        px-5 py-4 sm:px-6 sm:py-5
        flex flex-col sm:flex-row items-center gap-4 sm:gap-6
      ">

				{/* Avatar stack — always LTR visually */}
				<div dir="ltr" className="flex items-center shrink-0">
					{AVATAR_SRCS.map((src, i) => (
						<div
							key={src}
							className="
                relative w-11 h-11 sm:w-[52px] sm:h-[52px]
                rounded-full overflow-hidden
                border-[2.5px] border-white
                shadow-md
                hover:scale-110 hover:z-10
                transition-transform duration-200
              "
							style={{ marginLeft: i === 0 ? 0 : -12, zIndex: i + 1 }}
						>
							<Image
								src={src}
								alt={t('avatarAlt', { index: String(i + 1) })}
								fill
								className="object-cover"
								sizes="52px"
							/>
						</div>
					))}

					{/* "+50K" overflow bubble */}
					<div
						className="
              relative w-11 h-11 sm:w-[52px] sm:h-[52px]
              rounded-full
              border-[2.5px] border-white
              bg-[color:var(--secondary)]
              flex items-center justify-center
              shadow-md
            "
						style={{ marginLeft: -12, zIndex: AVATAR_SRCS.length + 1 }}
						aria-hidden="true"
					>
						<span className="text-white text-[10px] sm:text-[11px] font-black leading-none">
							{t('avatarMore')}
						</span>
					</div>
				</div>

				{/* Divider */}
				<div className="hidden sm:block w-px self-stretch bg-slate-200/80" aria-hidden="true" />

				{/* Rating block */}
				<div className="
          flex flex-row sm:flex-col
          items-center sm:ltr:items-end sm:rtl:items-start
          gap-3 sm:gap-1
        ">
					<p className="text-2xl sm:text-3xl font-black text-[color:var(--secondary)] leading-none tabular-nums">
						{RATING}
						<span className="text-sm font-semibold text-slate-400 ltr:ml-0.5 rtl:mr-0.5">/5</span>
					</p>
					<RatingStars rating={RATING} />
					<p className="
            text-[11px] text-slate-400 font-medium
            sm:ltr:text-right sm:rtl:text-left
            whitespace-nowrap
          ">
						{t('ratingLabel')}
					</p>
				</div>
			</div>
		</div>
	);
} 