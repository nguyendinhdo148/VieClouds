import DashboardLayout from "../layout/DashboardLayout.jsx";
import { Check, Crown, Star } from "lucide-react";
import { pricingPlans } from "../assets/data.js";

const Subscription = () => {
    const handleSubscribe = (planName) => {
        // Xử lý logic đăng ký gói
        console.log(`Đăng ký gói: ${planName}`);
        // TODO: Implement subscription logic
    };

    return (
        <DashboardLayout activeMenu="Subscription">
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Gói Subscription</h1>
                    <p className="text-lg text-gray-600">Chọn gói phù hợp với nhu cầu sử dụng của bạn</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <div 
                            key={index} 
                            className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                                plan.highlighted 
                                    ? 'border-purple-500 transform scale-105' 
                                    : 'border-gray-200 hover:border-purple-300'
                            }`}
                        >
                            {/* Badge */}
                            {(plan.highlighted || plan.badge) && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                                        <Star className="w-4 h-4 mr-1" />
                                        {plan.badge || "Phổ biến"}
                                    </span>
                                </div>
                            )}

                            <div className="p-8">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <p className="text-gray-600 mb-4">{plan.description}</p>
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                        {plan.billingCycle && (
                                            <span className="text-lg text-gray-500">/{plan.billingCycle}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-8">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                                <span className="ml-3 text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* Notes */}
                                    {plan.notes && (
                                        <div className="mt-4 text-xs text-gray-500 italic leading-relaxed">
                                            {plan.notes}
                                        </div>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <button 
                                    onClick={() => handleSubscribe(plan.name)}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                                        plan.highlighted
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                                    }`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Current Plan Status */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Crown className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Gói hiện tại</h3>
                                <p className="text-blue-600">Cơ Bản - Miễn phí</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Dung lượng đã sử dụng</p>
                            <p className="text-lg font-semibold text-gray-900">2.3GB / 10GB</p>
                            <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{width: '23%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credit Information */}
                <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Credit của bạn</h3>
                                <p className="text-green-600">Được cấp 50 Credit mỗi tháng*</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Credit còn lại</p>
                            <p className="text-2xl font-bold text-green-600">37</p>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 italic">
                        * Số credit này dùng cho mục đích thực hiện số lần tải lên/tải xuống file
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Subscription