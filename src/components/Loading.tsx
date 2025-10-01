import Image from "next/image";
import React from "react";

const Loading: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <Image
                src="/loadingCow.gif"
                alt="Loading..."
                className="w-32 h-32"
                width={128}
                height={128}
                unoptimized
            />
        </div>
    );
};

export default Loading;