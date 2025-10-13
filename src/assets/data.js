import {CreditCard, Files, LayoutDashboard, Receipt, Upload, Share2} from "lucide-react";

export const features = [
  {
    iconName: "ArrowUpCircle",
    iconColor: "text-purple-500",
    title: "Truyền P2P Siêu Nhanh",
    description: "Truyền file trực tiếp giữa các thiết bị với tốc độ tối đa mà không qua server trung gian."
  },
  {
    iconName: "FileText",
    iconColor: "text-red-500",
    title: "Đa Định Dạng",
    description: "Hỗ trợ mọi loại file từ văn bản, hình ảnh, video đến các file lập trình."
  },
  {
    iconName: "Clock",
    iconColor: "text-indigo-500",
    title: "Kết Nối Tức Thời",
    description: "Tạo phòng chia sẻ và kết nối với thiết bị khác chỉ trong vài giây bằng mã QR."
  },
  {
    iconName: "Share2",
    iconColor: "text-blue-500",
    title: "Chia Sẻ Dễ Dàng",
    description: "Giao diện thân thiện, dễ sử dụng cho mọi người dùng từ cơ bản đến nâng cao."
  },
  {
    iconName: "Zap",
    iconColor: "text-yellow-500",
    title: "Hiệu Suất Cao",
    description: "Tối ưu hóa băng thông và CPU để đảm bảo trải nghiệm mượt mà nhất."
  },
  {
    iconName: "Wifi",
    iconColor: "text-green-500",
    title: "Kết Nối Ổn Định",
    description: "Công nghệ WebRTC tiên tiến đảm bảo kết nối ổn định và đáng tin cậy."
  }
];

export const pricingPlans = [
  {
    name: "Cơ Bản",
    price: "0đ",
    description: "Phù hợp sử dụng cơ bản",
    badge: "Phổ biến",
    features: [
      "Lưu trữ đám mây 10GB",
      "Được cấp 50 Credit mỗi tháng*"
    ],
    cta: "Bắt Đầu Ngay",
    highlighted: true,
    notes: "* Số credit này dùng cho mục đích thực hiện số lần tải lên/tải xuống file"
  },
  {
    name: "Nâng cao",
    price: "99.000đ",
    billingCycle: "tháng",
    description: "Phù hợp sử dụng nâng cao",
    features: [
      "Lưu trữ đám mây 100GB",
      "Hỗ trợ ưu tiên",
      "Được cấp 500 Credit mỗi tháng*"
    ],
    cta: "Nâng Cấp",
    highlighted: false,
    notes: "* Số credit này dùng cho mục đích thực hiện số lần tải lên/tải xuống file"
  },
  {
    name: "Không giới hạn",
    price: "399.000đ",
    billingCycle: "tháng",
    description: "Phù hợp cho nhu cầu sử dụng nhiều",
    features: [
      "Tất cả tính năng Cloud",
      "Lưu trữ đám mây không giới hạn",
      "Hỗ trợ 24/7",
      "Được cấp không giới hạn số credit mỗi tháng*"
    ],
    cta: "Nâng Cấp",
    highlighted: false,
    notes: "* Số credit này dùng cho mục đích thực hiện số lần tải lên/tải xuống file"
  }
];

export const testimonials = [
  {
    name: "Nguyễn Văn An",
    role: "Kỹ sư phần mềm",
    company: "TechVietnam Co.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "VieClouds là giải pháp hoàn hảo! Vừa lưu trữ file dự án an toàn trên cloud, vừa có thể chia sẻ P2P siêu nhanh khi cần. Không còn lo file bị mất hay truyền chậm.",
    rating: 5
  },
  {
    name: "Trần Thị Mai",
    role: "Nhà thiết kế đồ họa",
    company: "Creative Studio",
    image: "https://randomuser.me/api/portraits/women/46.jpg",
    quote: "Tôi yêu thích tính năng hybrid của VieClouds. Lưu trữ file thiết kế lâu dài trên cloud và chia sẻ tức thì qua P2P với khách hàng. Một ứng dụng giải quyết mọi nhu cầu.",
    rating: 5
  },
  {
    name: "Lê Minh Hoàng",
    role: "Quản lý dự án",
    company: "Digital Solutions",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    quote: "VieClouds kết hợp tốt nhất của cả hai thế giới: lưu trữ cloud để backup và P2P để chia sẻ nhanh. Team tôi đã tăng năng suất làm việc đáng kể.",
    rating: 5
  },
  {
    name: "Phạm Thu Hương",
    role: "Giám đốc Marketing",
    company: "MediaPlus Agency",
    image: "https://randomuser.me/api/portraits/women/25.jpg",
    quote: "Quản lý file marketing chưa bao giờ dễ dàng đến thế! Lưu trữ tất cả tài liệu trên cloud và chia sẻ tức thì với đối tác qua P2P. Tiết kiệm cả thời gian và chi phí.",
    rating: 5
  },
  {
    name: "Vũ Đình Khang",
    role: "Freelancer Video Editor",
    company: "Independent Creator",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
    quote: "Với file video nặng hàng GB, VieClouds là cứu cánh của tôi. Backup an toàn trên cloud và gửi cho khách hàng bằng P2P cực nhanh. Không lo giới hạn dung lượng email.",
    rating: 5
  },
  {
    name: "Ngô Thị Lan",
    role: "Chuyên viên IT",
    company: "SmartTech Solutions",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    quote: "Giải pháp lưu trữ và chia sẻ file toàn diện nhất tôi từng dùng. Cloud storage cho dữ liệu quan trọng và P2P cho việc chia sẻ khẩn cấp. Hoàn hảo cho doanh nghiệp.",
    rating: 5
  }
];

// side menu bar options
export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Upload",
        icon: Upload,
        path: "/upload",
    },
    {
        id: "03",
        label: "My Files",
        icon: Files,
        path: "/my-files",
    },
    {
        id: "04",
        label: "P2P Share",
        icon: Share2,
        path: "http://localhost:3000",
        external: true,
    },
    {
        id: "05",
        label: "Subscriptions",
        icon: CreditCard,
        path: "/subscriptions",
    },
    {
        id: "06",
        label: "Transactions",
        icon: Receipt,
        path: "/transactions",
    },
];