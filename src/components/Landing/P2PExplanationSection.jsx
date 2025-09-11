import { Zap, Globe, Users, ArrowRight, Clock, Monitor } from "lucide-react";

const P2PExplanationSection = () => {
    const benefits = [
        {
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            title: "Tốc độ siêu nhanh",
            description: "Truyền file trực tiếp giữa các thiết bị mà không qua server trung gian, đạt tốc độ tối đa của kết nối internet."
        },
        {
            icon: <Users className="w-6 h-6 text-purple-500" />,
            title: "Kết nối trực tiếp",
            description: "Kết nối peer-to-peer cho phép chia sẻ ngay cả khi offline với server trung tâm."
        },
        {
            icon: <Globe className="w-6 h-6 text-blue-500" />,
            title: "Không giới hạn địa lý",
            description: "Chia sẻ file với bất kỳ ai, ở bất kỳ đâu trên thế giới với kết nối internet."
        },
        {
            icon: <Monitor className="w-6 h-6 text-green-500" />,
            title: "Đa nền tảng",
            description: "Hoạt động trên mọi thiết bị: máy tính, điện thoại, máy tính bảng với trình duyệt web."
        }
    ];

    const steps = [
        {
            step: "1",
            title: "Tạo phòng chia sẻ",
            description: "Tạo một phòng chia sẻ duy nhất và nhận mã QR hoặc link chia sẻ"
        },
        {
            step: "2", 
            title: "Kết nối thiết bị",
            description: "Thiết bị khác quét mã QR hoặc truy cập link để tham gia phòng"
        },
        {
            step: "3",
            title: "Truyền trực tiếp",
            description: "File được truyền trực tiếp giữa các thiết bị qua kết nối P2P ổn định"
        }
    ];

    return (
        <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
                        Công nghệ P2P là gì?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Peer-to-Peer (P2P) là công nghệ cho phép các thiết bị kết nối và chia sẻ dữ liệu trực tiếp 
                        với nhau mà không cần qua server trung gian, mang lại tốc độ nhanh và hiệu suất cao.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg mb-4">
                                {benefit.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* How it works */}
                <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
                    <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Cách hoạt động của VieClouds P2P
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg">
                                            {step.step}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                            {step.title}
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Arrow between steps */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-6 -right-4 text-gray-300">
                                        <ArrowRight size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance highlight */}
                <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Hiệu suất là ưu tiên hàng đầu
                        </h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                            Với công nghệ WebRTC tiên tiến và kết nối P2P trực tiếp, 
                            VieClouds mang đến trải nghiệm chia sẻ file nhanh chóng và ổn định nhất.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                                <Clock className="w-4 h-4 text-blue-500 mr-2" />
                                Kết nối tức thời
                            </div>
                            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                                <Zap className="w-4 h-4 text-blue-500 mr-2" />
                                Tốc độ tối đa
                            </div>
                            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                                <Globe className="w-4 h-4 text-blue-500 mr-2" />
                                Đa nền tảng
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default P2PExplanationSection;
