import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();

  const categoryNames = ["iOS", "Android", "Laptops", "Headphones"];
  const categories = {};

  for (const name of categoryNames) {
    let category = await Category.findOne({ name });
    if (!category) {
      category = await Category.create({ name });
    }
    categories[name] = category._id;
  }

  const products = [
    // iOS
    {
      name: "iPhone 15 Pro",
      stock: 20,
      price: 1299,
      imageUrls: [
        "/images/15-pro.png",
        "/images/15-pro1.png",
        "/images/15-pro2.png",
        "/images/15-pro3.png",
        "/images/15-pro4.png",
      ],
      description: "Apple's latest iPhone with powerful performance.",
      categoryId: categories["iOS"],
      isBestSeller: true,
      isNewest: true,
    },
    {
      name: "iPhone SE 3rd Gen",
      stock: 18,
      price: 499,
      imageUrls: [
        "/images/iphone-se.png",
        "/images/iphone-se1.png",
        "/images/iphone-se2.png",
        "/images/iphone-se3.png",
        "/images/iphone-se4.png",
      ],
      description: "Compact and affordable iPhone with A15 chip.",
      categoryId: categories["iOS"],
      isBestSeller: false,
      isNewest: false,
    },
    {
      name: "iPhone 14",
      stock: 10,
      price: 999,
      imageUrls: [
        "/images/iphone-14.png",
        "/images/iphone-141.png",
        "/images/iphone-142.png",
        "/images/iphone-143.png",
        "/images/iphone-144.png",
      ],
      description: "Smooth performance with cinematic mode.",
      categoryId: categories["iOS"],
      isBestSeller: false,
      isNewest: true,
    },
    {
      name: "iPhone 13 Mini",
      stock: 12,
      price: 799,
      imageUrls: [
        "/images/iphone-13-mini.png",
        "/images/iphone-13-mini1.png",
        "/images/iphone-13-mini2.png",
        "/images/iphone-13-mini3.png",
        "/images/iphone-13-mini4.png",
      ],
      description: "Powerful performance in a compact size.",
      categoryId: categories["iOS"],
      isBestSeller: false,
      isNewest: false,
    },

    // Android
    {
      name: "Samsung Galaxy S24",
      stock: 15,
      price: 1099,
      imageUrls: [
        "/images/s-24.png",
        "/images/s-241.png",
        "/images/s-242.png",
        "/images/s-243.png",
        "/images/s-244.png",
      ],
      description: "Samsung’s flagship Android smartphone.",
      categoryId: categories["Android"],
      isBestSeller: true,
      isNewest: true,
    },
    {
      name: "Google Pixel 8 Pro",
      stock: 14,
      price: 999,
      imageUrls: [
        "/images/pixel-8-pro.png",
        "/images/pixel-8-pro1.png",
        "/images/pixel-8-pro2.png",
        "/images/pixel-8-pro3.png",
        "/images/pixel-8-pro4.png",
      ],
      description: "Google’s AI-powered smartphone with great camera.",
      categoryId: categories["Android"],
      isBestSeller: false,
      isNewest: false,
    },
    {
      name: "OnePlus 12",
      stock: 11,
      price: 899,
      imageUrls: [
        "/images/oneplus-12.png",
        "/images/oneplus-121.png",
        "/images/oneplus-122.png",
        "/images/oneplus-123.png",
        "/images/oneplus-124.png",
      ],
      description: "Flagship killer with top specs and fast charging.",
      categoryId: categories["Android"],
      isBestSeller: false,
      isNewest: true,
    },
    {
      name: "Xiaomi 14 Ultra",
      stock: 16,
      price: 849,
      imageUrls: [
        "/images/xiaomi-14-ultra.png",
        "/images/xiaomi-14-ultra1.png",
        "/images/xiaomi-14-ultra2.png",
        "/images/xiaomi-14-ultra3.png",
        "/images/xiaomi-14-ultra4.png",
      ],
      description: "Ultra-high resolution camera and sleek design.",
      categoryId: categories["Android"],
      isBestSeller: false,
      isNewest: false,
    },

    // Laptops
    {
      name: "MacBook Pro M3",
      stock: 8,
      price: 2399,
      imageUrls: [
        "/images/pro-m3.png",
        "/images/pro-m31.png",
        "/images/pro-m32.png",
        "/images/pro-m33.png",
        "/images/pro-m34.png",
      ],
      description: "Powerful Apple laptop with M3 chip.",
      categoryId: categories["Laptops"],
      isBestSeller: true,
      isNewest: true,
    },
    {
      name: "Dell XPS 15",
      stock: 9,
      price: 1999,
      imageUrls: [
        "/images/dell-xps.png",
        "/images/dell-xps1.png",
        "/images/dell-xps2.png",
        "/images/dell-xps3.png",
        "/images/dell-xps4.png",
      ],
      description: "High-end Windows laptop with stunning display.",
      categoryId: categories["Laptops"],
      isBestSeller: false,
      isNewest: false,
    },
    {
      name: "HP Spectre x360",
      stock: 10,
      price: 1899,
      imageUrls: [
        "/images/hp-spectre.png",
        "/images/hp-spectre1.png",
        "/images/hp-spectre2.png",
        "/images/hp-spectre3.png",
        "/images/hp-spectre4.png",
      ],
      description: "Convertible laptop with elegant design.",
      categoryId: categories["Laptops"],
      isBestSeller: false,
      isNewest: true,
    },
    {
      name: "ASUS ROG Zephyrus G14",
      stock: 6,
      price: 1799,
      imageUrls: [
        "/images/rog-g14.png",
        "/images/rog-g141.png",
        "/images/rog-g142.png",
        "/images/rog-g143.png",
        "/images/rog-g144.png",
      ],
      description: "Gaming beast with Ryzen and RTX GPU.",
      categoryId: categories["Laptops"],
      isBestSeller: false,
      isNewest: false,
    },

    // Headphones
    {
      name: "Sony WH-1000XM5",
      stock: 25,
      price: 499,
      imageUrls: [
        "/images/sony-xm5.png",
        "/images/sony-xm51.png",
        "/images/sony-xm52.png",
        "/images/sony-xm53.png",
        "/images/sony-xm54.png",
      ],
      description: "Industry-leading noise-canceling headphones.",
      categoryId: categories["Headphones"],
      isBestSeller: true,
      isNewest: true,
    },
    {
      name: "Apple AirPods Max",
      stock: 20,
      price: 549,
      imageUrls: [
        "/images/airpods-max.png",
        "/images/airpods-max1.png",
        "/images/airpods-max2.png",
        "/images/airpods-max3.png",
        "/images/airpods-max4.png",
      ],
      description: "Apple's premium over-ear headphones.",
      categoryId: categories["Headphones"],
      isBestSeller: false,
      isNewest: false,
    },
    {
      name: "Bose QuietComfort 45",
      stock: 22,
      price: 399,
      imageUrls: [
        "/images/bose-qc45.png",
        "/images/bose-qc451.png",
        "/images/bose-qc452.png",
        "/images/bose-qc453.png",
        "/images/bose-qc454.png",
      ],
      description: "Comfort and silence, perfectly combined.",
      categoryId: categories["Headphones"],
      isBestSeller: false,
      isNewest: true,
    },
    {
      name: "Sennheiser Momentum 4",
      stock: 18,
      price: 379,
      imageUrls: [
        "/images/momentum-4.png",
        "/images/momentum-41.png",
        "/images/momentum-42.png",
        "/images/momentum-43.png",
        "/images/momentum-44.png",
      ],
      description: "Balanced sound with long battery life.",
      categoryId: categories["Headphones"],
      isBestSeller: false,
      isNewest: false,
    },
  ];

  const savedProducts = [];
  for (const product of products) {
    const existing = await Product.findOne({ name: product.name });
    if (!existing) {
      const created = await Product.create(product);
      savedProducts.push(created);
    }
  }

  return Response.json({
    message: "Categories and products seeded successfully.",
    products: savedProducts.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.categoryId,
    })),
  });
}
