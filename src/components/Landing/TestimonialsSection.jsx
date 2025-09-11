import { Star } from "lucide-react";

const TestimonialsSection = ({testimonials}) => {
    return (
        <div className="py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Được các chuyên gia trên toàn thế giới tin tưởng
                    </h2>
                    <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
                        Xem người dùng của chúng tôi nói gì về VieClouds
                    </p>
                </div>
                
                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl">
                            <div className="flex items-start mb-4">
                                <div className="flex-shrink-0 mr-4">
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.name} 
                                        className="h-14 w-14 rounded-full object-cover border-2 border-gray-200"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{testimonial.role}, {testimonial.company}</p>
                                </div>
                            </div>
                            
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={18}
                                        className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current mr-1`} 
                                    />
                                ))}
                            </div>
                            
                            <blockquote className="mt-2 flex-1">
                                <p className="text-gray-700 italic leading-relaxed">
                                    "{testimonial.quote}"
                                </p>
                            </blockquote>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TestimonialsSection;