import Image from "next/image";

interface TeamMemberCardProps {
    imageSrc: string;
    name: string;
    job: string;
    description: string;
}


export default function TeamMemberCard({ imageSrc, name, job, description }: TeamMemberCardProps) {
    return (
        <div className="team-member w-full max-w-[400px] rounded-[24px] p-6 flex flex-col" data-aos="fade-up">
            {/* Image */}
            <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-light mb-6">
                <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover rounded-[24px] grayscale"
                />
            </div>

            {/* Name */}
            <h2 className="font-['Playfair_Display'] font-normal text-[28px] md:text-[32px] lg:text-[40px] leading-[100%] text-gray-dark mb-3">
                {name}
            </h2>

            {/* Job */}
            <p className="mb-3 font-normal text-[12px] md:text-[14px] leading-[100%] uppercase text-gray-dark">
                {job}
            </p>

            {/* Description */}
            <p className="mt-4 font-normal text-[16px] md:text-[18px] leading-[24px] md:leading-[27px] text-gray-dark">
                {description}
            </p>
        </div>
    );
}
