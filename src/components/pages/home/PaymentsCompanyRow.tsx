import Image from "next/image";

export default function PaymentsCompanyRow() {
    return (
        <div className="bg-secondary">
            <div className="px-4 py-4 lg:py-6 sm:px-6 lg:px-8 xl:px-10 container overflow-x-auto">
                <div className="flex items-center gap-6 sm:gap-8 md:gap-12 min-w-max justify-center">
                    <ResponsiveIcon src="/payments/paypal.svg" alt="paypal" />
                    <Balls />
                    <ResponsiveIcon src="/payments/GreenHouse.svg" alt="GreenHouse" />
                    <Balls />
                    <ResponsiveIcon src="/payments/houseHold.svg" alt="houseHold" />
                    <Balls />
                    <ResponsiveIcon src="/payments/Century.svg" alt="Century" />
                </div>
            </div>
        </div>
    );
}

function ResponsiveIcon({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="w-[120px] sm:w-[160px] xl:w-[200px] h-auto shrink-0">
            <Image
                src={src}
                alt={alt}
                width={0}
                height={0}
                className="w-full h-auto"
                sizes="(max-width: 768px) 120px, (max-width: 1280px) 160px, 200px"
            />
        </div>
    );
}

function Balls() {
    return (
        <div className="flex items-center justify-center shrink-0">
            <div className="me-[-24px] sm:me-[-32px] md:me-[-40px] bg-[#E1E1E1] rounded-full w-[40px] sm:w-[55px] md:w-[67px] h-[40px] sm:h-[55px] md:h-[67px] z-[2]"></div>
            <div className="bg-white rounded-full w-[40px] sm:w-[55px] md:w-[67px] h-[40px] sm:h-[55px] md:h-[67px]"></div>
        </div>
    );
}
