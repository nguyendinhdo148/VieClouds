import { useState } from "react";
import { Info } from "lucide-react";

const Tooltip = ({ content, children, position = "top" }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`absolute z-[9999] ${positionClasses[position]}`}>
                    <div className="bg-gray-800 text-white text-sm px-4 py-3 rounded-lg shadow-lg min-w-max whitespace-nowrap">
                        {content}
                        {/* Arrow */}
                        <div className={`absolute w-0 h-0 ${
                            position === "top" 
                                ? "top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
                                : position === "bottom"
                                ? "bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"
                                : position === "left"
                                ? "left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800"
                                : "right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"
                        }`}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Component wrapper cho Info icon
export const InfoTooltip = ({ content, position = "top", className = "" }) => {
    return (
        <Tooltip content={content} position={position}>
            <Info 
                className={`w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors ${className}`} 
            />
        </Tooltip>
    );
};

export default Tooltip;
