import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const products = [
  {
    name: "Chè Thái Nguyên Đặc Biệt",
    price: 250000,
    category: "Lục trà",
    origin: "Thái Nguyên",
    description: "Chè Thái Nguyên nổi tiếng với hương cốm non, vị chát dịu và hậu ngọt sâu.",
    images: ["https://picsum.photos/seed/greentea1/800/800"],
    stock: 100,
    rating: 4.8,
    reviewsCount: 45
  },
  {
    name: "Hồng Trà Cổ Thụ Hà Giang",
    price: 450000,
    category: "Hồng trà",
    origin: "Hà Giang",
    description: "Được chế biến từ những búp trà Shan Tuyết cổ thụ, mang hương thơm trái cây chín và vị ngọt mật.",
    images: ["https://picsum.photos/seed/blacktea1/800/800"],
    stock: 50,
    rating: 4.9,
    reviewsCount: 32
  },
  {
    name: "Chè Shan Tuyết Suối Giàng",
    price: 600000,
    category: "Bạch trà",
    origin: "Yên Bái",
    description: "Chè Shan Tuyết tinh khiết từ vùng núi cao Suối Giàng, hương thanh tao, vị ngọt thanh mát.",
    images: ["https://picsum.photos/seed/whitetea1/800/800"],
    stock: 30,
    rating: 5.0,
    reviewsCount: 18
  },
  {
    name: "Oolong Tứ Quý Lâm Đồng",
    price: 350000,
    category: "Oolong",
    origin: "Lâm Đồng",
    description: "Trà Oolong Tứ Quý có hương hoa lan nồng nàn, nước trà vàng xanh trong trẻo.",
    images: ["https://picsum.photos/seed/oolong1/800/800"],
    stock: 80,
    rating: 4.7,
    reviewsCount: 28
  },
  {
    name: "Phổ Nhĩ Sống Tây Côn Lĩnh",
    price: 1200000,
    category: "Phổ Nhĩ",
    origin: "Hà Giang",
    description: "Trà Phổ Nhĩ sống được ép bánh từ lá trà cổ thụ, càng để lâu càng ngon và giá trị.",
    images: ["https://picsum.photos/seed/puerh1/800/800"],
    stock: 20,
    rating: 4.9,
    reviewsCount: 12
  },
  {
    name: "Chè Vằng Sẻ Quảng Trị",
    price: 150000,
    category: "Trà thảo mộc",
    origin: "Quảng Trị",
    description: "Chè Vằng sẻ giúp thanh nhiệt, giải độc, đặc biệt tốt cho phụ nữ sau sinh.",
    images: ["https://picsum.photos/seed/chevang/800/800"],
    stock: 150,
    rating: 4.6,
    reviewsCount: 56
  },
  {
    name: "Trà Sen Tây Hồ",
    price: 800000,
    category: "Lục trà",
    origin: "Hà Nội",
    description: "Đệ nhất trà Việt, được ướp từ sen bách diệp Tây Hồ theo phương pháp truyền thống.",
    images: ["https://picsum.photos/seed/lotustea1/800/800"],
    stock: 15,
    rating: 5.0,
    reviewsCount: 25
  },
  {
    name: "Chè Dây Cao Bằng",
    price: 180000,
    category: "Trà thảo mộc",
    origin: "Cao Bằng",
    description: "Chè dây rừng tự nhiên, hỗ trợ tiêu hóa và giảm viêm loét dạ dày.",
    images: ["https://picsum.photos/seed/cheday/800/800"],
    stock: 120,
    rating: 4.7,
    reviewsCount: 40
  },
  {
    name: "Chè Đắng Cao Bằng",
    price: 320000,
    category: "Trà thảo mộc",
    origin: "Cao Bằng",
    description: "Loại trà có vị đắng đặc trưng nhưng hậu ngọt, giúp ổn định huyết áp và đường huyết.",
    images: ["https://picsum.photos/seed/chedang/800/800"],
    stock: 40,
    rating: 4.8,
    reviewsCount: 22
  },
  {
    name: "Bạch Trà Móng Rồng",
    price: 750000,
    category: "Bạch trà",
    origin: "Hà Giang",
    description: "Loại trà quý hiếm có hình dáng như móng rồng, hương vị độc đáo của nhựa thông và hoa rừng.",
    images: ["https://picsum.photos/seed/dragontea1/800/800"],
    stock: 25,
    rating: 4.9,
    reviewsCount: 15
  },
  {
    name: "Oolong Kim Tuyên",
    price: 400000,
    category: "Oolong",
    origin: "Lâm Đồng",
    description: "Trà Oolong có vị sữa đặc trưng, hương thơm dịu nhẹ, rất được phái nữ ưa chuộng.",
    images: ["https://picsum.photos/seed/oolong2/800/800"],
    stock: 70,
    rating: 4.7,
    reviewsCount: 35
  },
  {
    name: "Phổ Nhĩ Chín 10 Năm",
    price: 1500000,
    category: "Phổ Nhĩ",
    origin: "Vân Nam",
    description: "Trà Phổ Nhĩ chín đã lên men lâu năm, vị ngọt dịu, nước trà đỏ đậm như rượu vang.",
    images: ["https://picsum.photos/seed/puerh2/800/800"],
    stock: 10,
    rating: 5.0,
    reviewsCount: 8
  },
  {
    name: "Trà Gạo Lứt Huyết Rồng",
    price: 120000,
    category: "Trà thảo mộc",
    origin: "Đồng Tháp",
    description: "Trà gạo lứt rang thơm phức, giàu dinh dưỡng, hỗ trợ giảm cân và thanh lọc cơ thể.",
    images: ["https://picsum.photos/seed/rice1/800/800"],
    stock: 200,
    rating: 4.5,
    reviewsCount: 60
  },
  {
    name: "Chè Đinh Thái Nguyên Cao Cấp",
    price: 1000000,
    category: "Lục trà",
    origin: "Thái Nguyên",
    description: "Được làm từ những mầm trà nhỏ nhất như chiếc đinh, là loại chè xanh cao cấp nhất.",
    images: ["https://picsum.photos/seed/dingtea1/800/800"],
    stock: 20,
    rating: 5.0,
    reviewsCount: 10
  },
  {
    name: "Chè Tươi Lá Già",
    price: 50000,
    category: "Lục trà",
    origin: "Nghệ An",
    description: "Lá chè tươi hái từ vườn, dùng để nấu nước uống hàng ngày, thanh nhiệt và giải khát.",
    images: ["https://picsum.photos/seed/chetuoi/800/800"],
    stock: 500,
    rating: 4.9,
    reviewsCount: 100
  }
];

export const seedProducts = async () => {
  const hasSeeded = localStorage.getItem('products_seeded_v2');
  if (hasSeeded) return;

  const productsCol = collection(db, 'products');
  console.log('Seeding 15 products...');
  
  try {
    for (const product of products) {
      await addDoc(productsCol, product);
    }
    localStorage.setItem('products_seeded_v2', 'true');
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};
