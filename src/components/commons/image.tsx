import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    fallbackSrc = "/images/fallback.jpg",
    alt,
    className,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <>
            {!isLoaded && !hasError && (
                <Skeleton className={className || "size-full"} />
            )}
            {!hasError && (
                <img
                    {...props}
                    src={src}
                    alt={alt}
                    className={`${className} ${!isLoaded ? "hidden" : ""}`}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setHasError(true);
                        setIsLoaded(true); // hide skeleton
                    }}
                />
            )}
            {hasError && (
                <img
                    {...props}
                    src={fallbackSrc}
                    alt="Fallback"
                    className={className}
                />
            )}
        </>
    );
};

export { ImageWithFallback };
