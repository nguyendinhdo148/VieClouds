const CTASection = ({openSignUp}) => {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    Sẵn sàng trải nghiệm?
                </h2>
                <p className="mt-4 text-xl text-blue-100">
                    Bắt đầu chia sẻ file trực tiếp, an toàn và nhanh chóng ngay hôm nay.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                    onClick={()=> window.open('http://localhost:3000', '_blank')}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer shadow-lg">
                        Thử P2P ngay (Miễn phí)
                    </button>
                    <button
                    onClick={()=> openSignUp()}
                    className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-purple-700 transition-colors duration-200 cursor-pointer">
                        Đăng ký tài khoản
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CTASection;