import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "shop": "Shop",
        "about": "About",
        "contact": "Contact",
        "admin": "Admin"
      },
      "hero": {
        "title": "Phúc Linh Tea",
        "subtitle": "The essence of Vietnamese tea culture",
        "cta": "Shop Now"
      },
      "footer": {
        "description": "Phúc Linh - Bringing the finest Vietnamese tea to your home.",
        "quickLinks": "Quick Links",
        "contact": "Contact Us",
        "rights": "All rights reserved."
      },
      "common": {
        "price": "Price",
        "stock": "Stock",
        "category": "Category",
        "addToCart": "Add to Cart",
        "buyNow": "Buy Now",
        "search": "Search",
        "filter": "Filter"
      }
    }
  },
  vi: {
    translation: {
      "nav": {
        "home": "Trang chủ",
        "shop": "Cửa hàng",
        "about": "Giới thiệu",
        "contact": "Liên hệ",
        "admin": "Quản trị"
      },
      "hero": {
        "title": "Trà Phúc Linh",
        "subtitle": "Tinh hoa văn hóa trà Việt",
        "cta": "Mua ngay"
      },
      "footer": {
        "description": "Phúc Linh - Mang những phẩm trà Việt tinh túy nhất đến ngôi nhà của bạn.",
        "quickLinks": "Liên kết nhanh",
        "contact": "Liên hệ",
        "rights": "Bản quyền đã được bảo hộ."
      },
      "common": {
        "price": "Giá",
        "stock": "Kho",
        "category": "Danh mục",
        "addToCart": "Thêm vào giỏ",
        "buyNow": "Mua ngay",
        "search": "Tìm kiếm",
        "filter": "Lọc"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "home": "Accueil",
        "shop": "Boutique",
        "about": "À propos",
        "contact": "Contact",
        "admin": "Admin"
      },
      "hero": {
        "title": "Thé Phúc Linh",
        "subtitle": "L'essence de la culture du thé vietnamienne",
        "cta": "Acheter maintenant"
      },
      "footer": {
        "description": "Phúc Linh - Apporter le meilleur thé vietnamien chez vous.",
        "quickLinks": "Liens rapides",
        "contact": "Contactez-nous",
        "rights": "Tous droits réservés."
      },
      "common": {
        "price": "Prix",
        "stock": "Stock",
        "category": "Catégorie",
        "addToCart": "Ajouter au panier",
        "buyNow": "Acheter maintenant",
        "search": "Rechercher",
        "filter": "Filtrer"
      }
    }
  },
  ja: {
    translation: {
      "nav": {
        "home": "ホーム",
        "shop": "ショップ",
        "about": "私たちについて",
        "contact": "お問い合わせ",
        "admin": "管理"
      },
      "hero": {
        "title": "フックリン茶",
        "subtitle": "ベトナム茶文化の真髄",
        "cta": "今すぐ購入"
      },
      "footer": {
        "description": "フックリン - 最高のベトナム茶をあなたのご家庭に。",
        "quickLinks": "クイックリンク",
        "contact": "お問い合わせ",
        "rights": "全著作権所有。"
      },
      "common": {
        "price": "価格",
        "stock": "在庫",
        "category": "カテゴリー",
        "addToCart": "カートに入れる",
        "buyNow": "今すぐ購入",
        "search": "検索",
        "filter": "フィルター"
      }
    }
  },
  zh: {
    translation: {
      "nav": {
        "home": "首页",
        "shop": "商店",
        "about": "关于我们",
        "contact": "联系我们",
        "admin": "管理"
      },
      "hero": {
        "title": "福灵茶",
        "subtitle": "越南茶文化的精髓",
        "cta": "立即购买"
      },
      "footer": {
        "description": "福灵 - 将最好的越南茶带到您的家中。",
        "quickLinks": "快速链接",
        "contact": "联系我们",
        "rights": "版权所有。"
      },
      "common": {
        "price": "价格",
        "stock": "库存",
        "category": "类别",
        "addToCart": "加入购物车",
        "buyNow": "立即购买",
        "search": "搜索",
        "filter": "筛选"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
