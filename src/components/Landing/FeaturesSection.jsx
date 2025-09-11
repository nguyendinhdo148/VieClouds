import { ArrowUpCircle, Clock, CreditCard, FileText, Share2, Shield, Wallet, Zap, Wifi } from "lucide-react";

const FeaturesSection = ({ features }) => {
    const renderIcon = (iconName, iconColor) => {
        const iconProps = { size: 28, className: iconColor };

        switch (iconName) {
            case 'ArrowUpCircle':
                return <ArrowUpCircle {...iconProps} />;
            case 'Shield':
                return <Shield {...iconProps} />;    
            case 'Share2':
                return <Share2 {...iconProps} />;
            case 'CreditCard':
                return <CreditCard {...iconProps} />; 
            case 'FileText':
                return <FileText {...iconProps} />; 
            case 'Clock':
                return <Clock {...iconProps} />;
            case 'Wallet':
                return <Wallet {...iconProps} />;
            case 'Zap':
                return <Zap {...iconProps} />;
            case 'Wifi':
                return <Wifi {...iconProps} />;
            default:
                return <FileText {...iconProps} />;
        }
    };

    return (
        <div className="py-20 bg-white font-sans">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        Mọi thứ bạn cần để chia sẻ tệp
                    </h2>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
                        VieClouds cung cấp tất cả các công cụ bạn cần để quản lý nội dung kỹ thuật số của mình
                    </p>
                </div>
                
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="group flex flex-col h-full p-7 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors duration-300 mb-6">
                                {renderIcon(feature.iconName, feature.iconColor)}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            
                            <p className="text-gray-600 leading-7 flex-grow ">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;