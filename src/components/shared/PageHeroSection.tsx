import Image from 'next/image';
import SecondaryButton from './buttons/SecondaryButton';

interface PageHeroSectionProps {
    title: string;
    description?: string;
    buttonText?: string;
    imageSrc?: string;
    gradient?: string;
}

export default function PageHeroSection({
    title,
    description,
    buttonText = 'See More',
    imageSrc = '/main.jpg',
    gradient = 'linear-gradient(180deg, var(--primary) 22.12%, var(--lightGold) 85.1%)',
}: PageHeroSectionProps) {
    const headingClasses = description ? 'text-[40px] sm:text-[64px] lg:text-[96px]' : 'text-[32px] sm:text-[40px] lg:text-[56px]';

    return (
        <div className="relative px-2">
            <Image src={imageSrc} fill alt="hero" className="object-cover" />
            <div className="absolute inset-0 opacity-60" style={{ background: gradient }} />
            <div className="relative pt-[220px] lg:pt-[250px] px-4 sm:px-6 lg:px-12 container hero-height">
                <div className="flex flex-col items-center text-center">
                    <h1 className={`${headingClasses} font-bold text-white leading-tight`} >
                        {title}
                    </h1>
                    {description && <p className="text-base sm:text-xl lg:text-2xl text-white max-w-[90%] sm:max-w-[600px] lg:max-w-[663px] mb-4 sm:mb-6 lg:mb-[35px] mt-2 sm:mt-4 lg:mt-[10px]">
                        {description}
                    </p>}
                    {/* {<SecondaryButton className="bg-secondary transition-colors hover:bg-secondary-hover text-white text-base sm:text-lg">
                        {buttonText}
                    </SecondaryButton>} */}
                </div>
            </div>
        </div>
    );
}
