

export default function PageHeader({ title, className }: { title: string, className?: string }) {
    return (
        <div className={`flex-center flex-col gap-2 md:gap-3 lg:gap-[15px] py-8  ${className}`}>

            <div className="flex items-center gap-3">
                {/* Line before header */}
                <div className="w-[30px] h-[2.5px] bg-[#616161]"></div>

                <h1 className="text-3xl lg:text-4xl text-[#616161] font-semibold">{title}</h1>

                {/* Line after header */}
                <div className="w-[30px] h-[2.5px] bg-[#616161]"></div>
            </div>
        </div>
    );
}
