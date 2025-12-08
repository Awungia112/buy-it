import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            name: 'Premium Wireless Headphones',
            description: 'Experience crystal clear sound with our premium wireless headphones. Features active noise cancellation and 30-hour battery life.',
            price: 299.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80'
            ],
            colors: ['Black', 'White', 'Silver'],
            category: 'Electronics',
            stock: 50,
        },
        {
            name: 'Smart Watch Series 5',
            description: 'Stay connected and healthy with the latest Smart Watch. Tracks heart rate, sleep, and workouts.',
            price: 399.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
                'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80',
                'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80'
            ],
            colors: ['Black', 'Silver', 'Rose Gold'],
            category: 'Electronics',
            stock: 30,
        },
        {
            name: 'Professional Camera Kit',
            description: 'Capture life\'s moments in stunning detail with this professional camera kit. Includes 2 lenses and a carrying case.',
            price: 1299.99,
            image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
                'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&q=80',
                'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80'
            ],
            colors: ['Black'],
            category: 'Electronics',
            stock: 15,
        },
        {
            name: 'Designer Sunglasses',
            description: 'Protect your eyes in style with these designer sunglasses. UV400 protection.',
            price: 159.99,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
                'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
                'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&q=80'
            ],
            colors: ['Black', 'Brown', 'Clear'],
            category: 'Fashion',
            stock: 100,
        },
        {
            name: 'Leather Weekend Bag',
            description: 'Handcrafted leather bag perfect for weekend getaways. Durable and stylish.',
            price: 249.99,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
                'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80',
                'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80'
            ],
            colors: ['Brown', 'Black', 'Tan'],
            category: 'Fashion',
            stock: 25,
        },
        {
            name: 'Mechanical Keyboard',
            description: 'Tactile and responsive mechanical keyboard for the ultimate typing experience. RGB backlighting.',
            price: 129.99,
            image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&q=80',
                'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
                'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80'
            ],
            colors: ['Black', 'White', 'RGB'],
            category: 'Electronics',
            stock: 40,
        },
        {
            name: 'Wireless Gaming Mouse',
            description: 'Precision gaming mouse with customizable DPI settings and ergonomic design. Perfect for competitive gaming.',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
                'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80',
                'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80'
            ],
            colors: ['Black', 'White', 'RGB'],
            category: 'Electronics',
            stock: 75,
        },
        {
            name: 'Portable Bluetooth Speaker',
            description: 'Compact and powerful Bluetooth speaker with 360-degree sound and waterproof design. Great for outdoor activities.',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
                'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
                'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'
            ],
            colors: ['Black', 'Blue', 'Red'],
            category: 'Electronics',
            stock: 60,
        },
        {
            name: 'Fitness Tracker Band',
            description: 'Advanced fitness tracker with heart rate monitoring, GPS, and sleep tracking. Water-resistant up to 50 meters.',
            price: 149.99,
            image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80',
                'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&q=80',
                'https://images.unsplash.com/photo-1506629905607-0b5ab9a9e21a?w=500&q=80'
            ],
            colors: ['Black', 'White', 'Pink'],
            category: 'Electronics',
            stock: 45,
        },
        {
            name: '4K Webcam for Streaming',
            description: 'Professional-grade webcam with 4K resolution, auto-focus, and built-in microphone. Perfect for content creators.',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&q=80',
                'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&q=80',
                'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&q=80'
            ],
            colors: ['Black'],
            category: 'Electronics',
            stock: 35,
        },
        {
            name: 'Ergonomic Office Chair',
            description: 'Premium ergonomic office chair with lumbar support and adjustable height. Designed for long work sessions.',
            price: 349.99,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
                'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&q=80',
                'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&q=80'
            ],
            colors: ['Black', 'White', 'Gray'],
            category: 'Furniture',
            stock: 20,
        },
        {
            name: 'Smart Home Hub',
            description: 'Control all your smart home devices from one central hub. Voice-activated and compatible with major platforms.',
            price: 129.99,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'
            ],
            colors: ['White', 'Black'],
            category: 'Electronics',
            stock: 55,
        },
        {
            name: 'Wireless Charging Pad',
            description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicators.',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=80',
                'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=80',
                'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=80'
            ],
            colors: ['White', 'Black'],
            category: 'Electronics',
            stock: 90,
        },
        {
            name: 'Noise-Cancelling Earbuds',
            description: 'Compact in-ear headphones with active noise cancellation and premium sound quality. Perfect for travel.',
            price: 179.99,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
                'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
                'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80'
            ],
            colors: ['Black', 'White'],
            category: 'Electronics',
            stock: 70,
        },
        {
            name: 'Digital Drawing Tablet',
            description: 'Professional digital drawing tablet with pressure sensitivity and battery-free stylus. Perfect for artists.',
            price: 249.99,
            image: 'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=500&q=80',
                'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=500&q=80',
                'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=500&q=80'
            ],
            colors: ['Black'],
            category: 'Electronics',
            stock: 30,
        },
        {
            name: 'Portable Power Bank',
            description: 'High-capacity power bank with fast charging and multiple USB ports. Keep your devices charged on the go.',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&q=80',
                'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&q=80',
                'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&q=80'
            ],
            colors: ['Black', 'White', 'Blue'],
            category: 'Electronics',
            stock: 85,
        },
    ];

    for (const product of products) {
        const existingProduct = await prisma.product.findFirst({
            where: { name: product.name },
        });

        if (!existingProduct) {
            await prisma.product.create({
                data: product,
            });
        }
    }

    // Create sample users
    const users = [
        {
            name: 'John Doe',
            email: 'john@example.com',
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
        },
        {
            name: 'Mike Johnson',
            email: 'mike@example.com',
        },
        {
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
        },
        {
            name: 'David Brown',
            email: 'david@example.com',
        },
        {
            name: 'Emily Davis',
            email: 'emily@example.com',
        },
        {
            name: 'Chris Lee',
            email: 'chris@example.com',
        },
        {
            name: 'Lisa Garcia',
            email: 'lisa@example.com',
        },
    ];

    for (const user of users) {
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });

        if (!existingUser) {
            await prisma.user.create({
                data: user,
            });
        }
    }

    // Get created users and products
    const createdUsers = await prisma.user.findMany();
    const createdProducts = await prisma.product.findMany();

    // Create sample orders with varied statuses and dates spanning 12 months
    const orders = [
        // Recent orders (last 30 days)
        {
            userId: createdUsers[0].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            items: [
                { productId: createdProducts[0].id, quantity: 1, price: createdProducts[0].price },
                { productId: createdProducts[1].id, quantity: 1, price: createdProducts[1].price },
            ],
        },
        {
            userId: createdUsers[1].id,
            status: 'PROCESSING',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            items: [
                { productId: createdProducts[2].id, quantity: 1, price: createdProducts[2].price },
            ],
        },
        {
            userId: createdUsers[2].id,
            status: 'SHIPPED',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            items: [
                { productId: createdProducts[3].id, quantity: 2, price: createdProducts[3].price },
                { productId: createdProducts[4].id, quantity: 1, price: createdProducts[4].price },
            ],
        },
        {
            userId: createdUsers[3].id,
            status: 'PENDING',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            items: [
                { productId: createdProducts[5].id, quantity: 1, price: createdProducts[5].price },
            ],
        },
        {
            userId: createdUsers[4].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
            items: [
                { productId: createdProducts[6].id, quantity: 1, price: createdProducts[6].price },
                { productId: createdProducts[7].id, quantity: 1, price: createdProducts[7].price },
                { productId: createdProducts[8].id, quantity: 1, price: createdProducts[8].price },
            ],
        },

        // Orders from 1-3 months ago
        {
            userId: createdUsers[5].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // ~1.5 months ago
            items: [
                { productId: createdProducts[9].id, quantity: 1, price: createdProducts[9].price },
                { productId: createdProducts[10].id, quantity: 2, price: createdProducts[10].price },
            ],
        },
        {
            userId: createdUsers[6].id,
            status: 'CANCELLED',
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
            items: [
                { productId: createdProducts[11].id, quantity: 1, price: createdProducts[11].price },
            ],
        },
        {
            userId: createdUsers[7].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), // ~2.5 months ago
            items: [
                { productId: createdProducts[12].id, quantity: 3, price: createdProducts[12].price },
                { productId: createdProducts[13].id, quantity: 1, price: createdProducts[13].price },
            ],
        },

        // Orders from 3-6 months ago
        {
            userId: createdUsers[0].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // ~3.3 months ago
            items: [
                { productId: createdProducts[14].id, quantity: 1, price: createdProducts[14].price },
                { productId: createdProducts[15].id, quantity: 1, price: createdProducts[15].price },
                { productId: createdProducts[0].id, quantity: 1, price: createdProducts[0].price },
            ],
        },
        {
            userId: createdUsers[1].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
            items: [
                { productId: createdProducts[1].id, quantity: 2, price: createdProducts[1].price },
                { productId: createdProducts[2].id, quantity: 1, price: createdProducts[2].price },
            ],
        },
        {
            userId: createdUsers[2].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 5 months ago
            items: [
                { productId: createdProducts[3].id, quantity: 1, price: createdProducts[3].price },
                { productId: createdProducts[4].id, quantity: 1, price: createdProducts[4].price },
                { productId: createdProducts[5].id, quantity: 1, price: createdProducts[5].price },
                { productId: createdProducts[6].id, quantity: 1, price: createdProducts[6].price },
            ],
        },

        // Orders from 6-9 months ago
        {
            userId: createdUsers[3].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // ~6.5 months ago
            items: [
                { productId: createdProducts[7].id, quantity: 2, price: createdProducts[7].price },
                { productId: createdProducts[8].id, quantity: 1, price: createdProducts[8].price },
            ],
        },
        {
            userId: createdUsers[4].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000), // 8 months ago
            items: [
                { productId: createdProducts[9].id, quantity: 1, price: createdProducts[9].price },
                { productId: createdProducts[10].id, quantity: 1, price: createdProducts[10].price },
                { productId: createdProducts[11].id, quantity: 1, price: createdProducts[11].price },
            ],
        },
        {
            userId: createdUsers[5].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000), // 9 months ago
            items: [
                { productId: createdProducts[12].id, quantity: 1, price: createdProducts[12].price },
            ],
        },

        // Orders from 9-12 months ago
        {
            userId: createdUsers[6].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000), // 10 months ago
            items: [
                { productId: createdProducts[13].id, quantity: 1, price: createdProducts[13].price },
                { productId: createdProducts[14].id, quantity: 2, price: createdProducts[14].price },
            ],
        },
        {
            userId: createdUsers[7].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000), // 11 months ago
            items: [
                { productId: createdProducts[15].id, quantity: 1, price: createdProducts[15].price },
                { productId: createdProducts[0].id, quantity: 1, price: createdProducts[0].price },
                { productId: createdProducts[1].id, quantity: 1, price: createdProducts[1].price },
            ],
        },
        {
            userId: createdUsers[0].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 360 * 24 * 60 * 60 * 1000), // 12 months ago
            items: [
                { productId: createdProducts[2].id, quantity: 1, price: createdProducts[2].price },
                { productId: createdProducts[3].id, quantity: 1, price: createdProducts[3].price },
            ],
        },
        {
            userId: createdUsers[1].id,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // ~12 months ago
            items: [
                { productId: createdProducts[4].id, quantity: 1, price: createdProducts[4].price },
            ],
        },
    ];

    for (const orderData of orders) {
        const total = orderData.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

        const order = await prisma.order.create({
            data: {
                userId: orderData.userId,
                total,
                status: orderData.status,
                createdAt: orderData.createdAt,
            },
        });

        for (const item of orderData.items) {
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                },
            });
        }
    }

    // Create sample ratings
    const ratings = [
        { userId: createdUsers[0].id, productId: createdProducts[0].id, rating: 5, comment: 'Amazing sound quality!' },
        { userId: createdUsers[1].id, productId: createdProducts[0].id, rating: 4, comment: 'Great headphones, very comfortable.' },
        { userId: createdUsers[2].id, productId: createdProducts[1].id, rating: 5, comment: 'Perfect smart watch for fitness tracking.' },
        { userId: createdUsers[3].id, productId: createdProducts[2].id, rating: 4, comment: 'Excellent camera, worth the price.' },
        { userId: createdUsers[4].id, productId: createdProducts[3].id, rating: 5, comment: 'Stylish and protective sunglasses.' },
        { userId: createdUsers[5].id, productId: createdProducts[4].id, rating: 4, comment: 'Beautiful leather bag, very durable.' },
        { userId: createdUsers[6].id, productId: createdProducts[5].id, rating: 5, comment: 'Best mechanical keyboard I\'ve used!' },
        { userId: createdUsers[7].id, productId: createdProducts[6].id, rating: 4, comment: 'Great gaming mouse, very responsive.' },
    ];

    for (const rating of ratings) {
        await prisma.rating.upsert({
            where: {
                userId_productId: {
                    userId: rating.userId,
                    productId: rating.productId,
                },
            },
            update: rating,
            create: rating,
        });
    }

    console.log('Seed data inserted successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
