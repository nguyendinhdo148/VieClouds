import dashboard from '../../assets/Dashboard.png';
import p2pImage from '../../assets/p2p.jpeg';

const HeroSection = ({openSignIn, openSignUp}) => {
    return (
        <div className="landing-page-content relative font-sans">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50 z-0 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Chia sẻ tập tin trực tiếp với</span>
                            <span className="block text-purple-600 mt-2 bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                                Công nghệ P2P
                            </span>
                        </h1>
                        <p className="mt-4 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-5 md:max-w-3xl md:text-2xl">
                            Nền tảng chia sẻ file peer-to-peer an toàn, nhanh chóng và không qua server trung gian. 
                            Truyền file trực tiếp giữa các thiết bị với tốc độ tối đa.
                        </p>
                        
                        {/* Highlights về P2P */}
                        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Truyền trực tiếp P2P
                            </div>
                            <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                Kết nối tức thời
                            </div>
                            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                Hiệu suất cao
                            </div>
                        </div>
                        
                        <div className="mt-8 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                            <div class="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:mx-auto">
                                <button 
                                onClick={() => openSignIn()}
                                type="button" class="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                    Đăng nhập
                                </button>
                                <button
                                onClick={() => openSignUp()}
                                type="button" class="flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard preview */}
                <div className="mt-12 lg:mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {/* Dashboard Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-500">
                            <img 
                                src={dashboard} 
                                alt="Bảng điều khiển VieClouds" 
                                className="w-full h-auto object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg pointer-events-none"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                                    Giao diện quản lý file trực quan
                                </p>
                            </div>
                        </div>

                        {/* P2P Technology Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-500">
                            <img 
                                src={p2pImage} 
                                alt="Công nghệ P2P chia sẻ file" 
                                className="w-full h-auto object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                                    Kết nối P2P trực tiếp giữa các thiết bị
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 italic">
                            Trải nghiệm chia sẻ file mới với công nghệ Peer-to-Peer tiên tiến
                        </p>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default HeroSection;