import Image from "next/image";

interface DepartmentSectionProps {
    imageSrc: string;
    title: string;
    text: string;
}

export default function DepartmentSection({ imageSrc, title, text }: DepartmentSectionProps) {
    return (
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-[30px]">
            {/* Image with overlay */}
            <div className="relative w-full max-w-[513px] h-[240px] md:h-[300px] lg:h-[357px] rounded-[4px] overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover rounded-[4px] opacity-95 mix-blend-multiply"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0)] to-black opacity-60 rounded-[4px]" />
            </div>
            <Image width={26} height={20} src="/about/quotes.svg" alt="" />
            {/* Text */}
            <div className="flex-1 flex flex-col gap-6 justify-between min-h-full">
                <p className="font-inter font-normal text-[16px] md:text-[18px] lg:text-[20px] leading-[35px] text-[#363636] text-justify">
                    {text}
                </p>
                <div className="mx-auto w-fit ">
                    <Image width={26} height={20} src="/about/quotes.svg" alt="" className="scale-x-[-1]" />
                </div>
            </div>
        </div>
    );
}
