import Image from "next/image";

interface TeamMemberProps {
    name: string;
    imageSrc: string;
    scale?: number; // default 1
}

export default function TeamMember({ name, imageSrc, scale = 1 }: TeamMemberProps) {
    return (
        <div
            className="transition flex items-center justify-end flex-col h-[600px]"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "center top", // keeps scaling consistent
            }}
        >
            <Image
                src={imageSrc}
                width={306}
                height={460}
                alt={name}
                className="w-auto h-[400px]  lg:h-[460px] z-[1] mb-[-60px] md:mb-[-70px] "
            />
            <div
                className=" z-[2] flex-center bg-secondary text-lighter py-6 sm:py-7 lg:py-10 w-[250px] sm:w-[270px] lg:w-[347px] text-lg sm:text-2xl lg:text-[32px]"
                style={{
                    clipPath: "polygon(0% 20%, 0% 80%, 100% 100%, 100% 0%)",
                }}
            >
                {name}
            </div>
        </div>
    );
}
