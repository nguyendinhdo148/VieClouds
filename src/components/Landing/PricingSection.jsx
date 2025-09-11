import { Check } from "lucide-react";

const PricingSection = ({pricingPlans, openSignUp}) => {
    return (
        <div className="py-20 bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Đơn giản, giá cả minh bạch
                    </h2>
                    <p className="mt-4 text-xl text-gray-500 mx-auto max-w-2xl">
                        Chọn gói phù hợp với bạn
                    </p>
                </div>

                <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                    {pricingPlans.map((plan, index) => (
                        <div 
                            key={index} 
                            className={`flex flex-col rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.highlighted ? 'border-2 border-purple-500 transform scale-105' : 'border border-gray-200'}`}
                        >
                            <div className={`px-6 py-8 ${plan.highlighted ? 'bg-gradient-to-br from-purple-50 to-white' : 'bg-white'}`}>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-semibold text-gray-900">
                                        {plan.name}
                                    </h3>
                                    {(plan.highlighted || plan.badge) && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                            {plan.badge || "Phổ biến"}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    {plan.description}
                                </p>

                                <div className="mt-8">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    {plan.billingCycle && (
                                        <span className="text-sm text-gray-500 ml-1">/{plan.billingCycle}</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <Check className="h-5 w-5 text-purple-500" />
                                            </div>
                                            <p className="ml-3 text-gray-700 leading-tight">{feature}</p>
                                        </li>
                                    ))}
                                </ul>
                                
                                {/* Notes */}
                                {plan.notes && (
                                    <div className="text-xs text-gray-500 italic leading-relaxed">
                                        {plan.notes}
                                    </div>
                                )}
                                
                                <div className="rounded-md shadow">
                                    <button 
                                    onClick={()=> openSignUp()}
                                        className={`w-full flex items-center justify-center px-5 py-3 border text-base font-medium rounded-md cursor-pointer transition-colors duration-200 ${
                                            plan.highlighted 
                                                ? 'text-white bg-purple-600 hover:bg-purple-700 border-transparent' 
                                                : 'text-purple-600 bg-white hover:bg-gray-50 border-purple-500'
                                        }`}
                                    >
                                        {plan.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PricingSection;