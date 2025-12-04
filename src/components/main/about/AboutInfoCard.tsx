interface InfoCardProps {
    title: string;
    text: string;
    className?: string; // optional extra styling
}

export default function AboutInfoCard({ title, text, className,...props }: InfoCardProps) {
    return (
        <div
          {...props} 
            className={`flex-1 min-h-[288px] bg-[#DFEEDB] rounded-[10px] p-6 
                  hover:shadow-[0px_4px_4px_0px_#00000040] transition-shadow duration-300 ${className}`}
        >
            {/* Header */}
            <h2 className="text-secondary font-semibold text-[24px] leading-[100%] text-center font-inter">
                {title}
            </h2>

            {/* Text */}
            <p className="mt-4 font-inter font-normal text-[15px] leading-[100%] text-justify text-[#363636]">
                {text}
            </p>
        </div>
    );
}
