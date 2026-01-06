
export function BlogCardSkeleton({ list = false }: { list?: boolean }) {
    return (
        <div className={`overflow-hidden w-full  relative ${!list && "max-w-[400px]"} rounded-[16px] flex ${list ? "flex-col w-full space-y-6" : "flex-col w-fit mx-auto space-y-7"} animate-pulse`}>
            <div className={`w-full ${list ? "h-[380px] sm:h-[400px] md:h-[420px] lg:h-[450px]" : "max-w-[400px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[360px]"} bg-gray-200 rounded-[16px]`}></div>
            <div className={`flex-1 flex flex-col gap-2 lg:gap-4 z-[1] mb-4 ${list ? "mt-5 md:mt-3" : ""}`}>
                {!list && <div className="h-4 w-1/3 bg-gray-300 rounded"></div>}
                <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                <div className={`h-4 ${list ? "w-full" : "w-5/6"} bg-gray-300 rounded mt-2`}></div>
                {!list && <div className="mx-auto h-10 w-32 bg-gray-300 rounded"></div>}
            </div>
        </div>
    );
}
