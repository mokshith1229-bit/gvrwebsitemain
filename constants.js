export const PRODUCTS = [
    // Dry Fruits & Nuts
    {
        id: '1',
        name: 'Cashew 180 Count',
        category: 'Dry Fruits & Nuts',
        description: 'Premium W180 "King Size" Cashews. The largest and finest grade, hand-picked for their impressive size and creamy texture.',
        price: 270,
        weight: '250g',
        mrp: 470,
        variants: [
            { weight: '250g', price: 270, mrp: 470, stock: 50 },
            { weight: '500g', price: 520, mrp: 900, stock: 30 },
            { weight: '1000g', price: 1020, mrp: 1750, stock: 20 }
        ],
        image: '/products/cashew-w180.png',
        rating: 4.9,
        tags: ['Premium', 'King Size']
    },
    {
        id: '2',
        name: 'Cashew 210 Count',
        category: 'Dry Fruits & Nuts',
        description: 'High-quality W210 Jumbo Cashews. Perfect balance of size and flavor, ideal for snacking or premium gifting.',
        price: 260,
        weight: '250g',
        mrp: 450,
        variants: [
            { weight: '250g', price: 260, mrp: 450, stock: 60 },
            { weight: '500g', price: 500, mrp: 850, stock: 40 },
            { weight: '1000g', price: 980, mrp: 1650, stock: 25 }
        ],
        image: '/products/cashew-w210.png',
        rating: 4.8,
        tags: ['Jumbo', 'Popular']
    },
    {
        id: '3',
        name: 'Cashew Split',
        category: 'Dry Fruits & Nuts',
        description: 'Fresh Cashew Splits. Excellent for cooking, baking, and making rich gravies or sweets.',
        price: 245,
        weight: '250g',
        mrp: 430,
        variants: [
            { weight: '250g', price: 245, mrp: 430, stock: 100 },
            { weight: '500g', price: 470, mrp: 820, stock: 50 }
        ],
        image: '/products/cashew-splits.png',
        rating: 4.5,
        tags: ['Cooking', 'Baking']
    },
    {
        id: '14',
        name: 'Cashew 6k',
        category: 'Dry Fruits & Nuts',
        description: 'Cashew 6K are high-grade cashew nuts known for their uniform size, smooth texture, and naturally rich taste.',
        price: 225,
        weight: '250g',
        mrp: 400,
        variants: [
            { weight: '250g', price: 225, mrp: 400, stock: 80 },
            { weight: '500g', price: 430, mrp: 760, stock: 40 }
        ],
        image: '/products/cashew-splits.png',
        rating: 4.5,
        tags: ['Cooking', 'Baking']
    },

    // Seeds
    {
        id: '4',
        name: 'Chia Seeds',
        category: 'Seeds',
        description: 'Organic raw Chia Seeds. A superfood powerhouse packed with Omega-3s, fiber, and protein.',
        price: 180,
        weight: '250g',
        mrp: 380,
        variants: [
            { weight: '250g', price: 180, mrp: 380, stock: 100 },
            { weight: '500g', price: 340, mrp: 700, stock: 50 },
            { weight: '1000g', price: 650, mrp: 1300, stock: 30 }
        ],
        image: '/products/chia-seeds.png',
        rating: 4.7,
        tags: ['Superfood', 'Healthy']
    },
    {
        id: '5',
        name: 'Pumpkin Seeds',
        category: 'Seeds',
        description: 'Premium raw Pumpkin Seeds. Crunchy, nutritious, and perfect for snacking or topping salads.',
        price: 220,
        weight: '250g',
        mrp: 420,
        variants: [
            { weight: '250g', price: 220, mrp: 420, stock: 80 },
            { weight: '500g', price: 410, mrp: 800, stock: 40 },
            { weight: '1000g', price: 790, mrp: 1500, stock: 20 }
        ],
        image: '/products/pumpkin-seeds.png',
        rating: 4.6,
        tags: ['Keto', 'Snack']
    },
    {
        id: '6',
        name: 'Flax Seeds',
        category: 'Seeds',
        description: 'Roasted Flax Seeds. Rich in fiber and essential fatty acids, great for heart health.',
        price: 140,
        weight: '250g',
        mrp: 290,
        variants: [
            { weight: '250g', price: 140, mrp: 290, stock: 120 },
            { weight: '500g', price: 260, mrp: 550, stock: 60 },
            { weight: '1000g', price: 490, mrp: 1000, stock: 40 }
        ],
        image: '/products/flax-seeds.png',
        rating: 4.5,
        tags: ['Fiber Rich', 'Heart Health']
    },

    // Dates
    {
        id: '7',
        name: 'Medjoul Dates',
        category: 'Dates',
        description: 'Premium Medjoul Dates. Large, soft, and naturally sweet "Fruit of Kings".',
        price: 650,
        weight: '500g',
        mrp: 950,
        variants: [
            { weight: '500g', price: 650, mrp: 950, stock: 40 },
            { weight: '1000g', price: 1200, mrp: 1800, stock: 20 }
        ],
        image: '/products/medjoul-dates.png',
        rating: 5.0,
        tags: ['Premium', 'Sweet']
    },
    {
        id: '8',
        name: 'Kimia Dates',
        category: 'Dates',
        description: 'Soft and fleshy Kimia Dates. Melt-in-the-mouth texture with a rich caramel-like taste.',
        price: 380,
        weight: '400g',
        mrp: 580,
        variants: [
            { weight: '400g', price: 380, mrp: 580, stock: 100 },
            { weight: '800g', price: 720, mrp: 1100, stock: 50 }
        ],
        image: '/products/kimia-dates.png',
        rating: 4.8,
        tags: ['Soft', 'Natural']
    },
    {
        id: '9',
        name: 'Dry Dates',
        category: 'Dates',
        description: 'High-quality Dry Dates (Chuara). Perfect for energy bars, desserts, or traditional offerings.',
        price: 210,
        weight: '250g',
        mrp: 350,
        variants: [
            { weight: '250g', price: 210, mrp: 350, stock: 150 },
            { weight: '500g', price: 400, mrp: 650, stock: 80 },
            { weight: '1000g', price: 780, mrp: 1250, stock: 40 }
        ],
        image: '/products/dry-dates.png',
        rating: 4.4,
        tags: ['Traditional', 'Energy']
    },

    // Spices
    {
        id: '10',
        name: 'Black Pepper',
        category: 'Spices',
        description: 'Malabar Black Pepper. Bold, aromatic, and spicy peppercorns sourced directly from spice gardens.',
        price: 180,
        weight: '100g',
        mrp: 280,
        variants: [
            { weight: '100g', price: 180, mrp: 280, stock: 200 },
            { weight: '250g', price: 420, mrp: 650, stock: 100 },
            { weight: '500g', price: 800, mrp: 1200, stock: 50 }
        ],
        image: '/products/black-pepper.png',
        rating: 4.8,
        tags: ['Spice', 'Aromatic']
    },
    {
        id: '11',
        name: 'Cloves',
        category: 'Spices',
        description: 'Premium hand-picked Cloves. Intense aroma and flavor, essential for biryanis and masalas.',
        price: 240,
        weight: '100g',
        mrp: 350,
        variants: [
            { weight: '100g', price: 240, mrp: 350, stock: 150 },
            { weight: '250g', price: 580, mrp: 850, stock: 70 },
            { weight: '500g', price: 1100, mrp: 1600, stock: 30 }
        ],
        image: '/products/cloves.png',
        rating: 4.7,
        tags: ['Aromatic', 'Premium']
    },
    {
        id: '12',
        name: 'Cinnamon Sticks',
        category: 'Spices',
        description: 'Ceylon Cinnamon Sticks. Sweet, woody fragrance and delicate flavor for savory and sweet dishes.',
        price: 120,
        weight: '50g',
        mrp: 200,
        variants: [
            { weight: '50g', price: 120, mrp: 200, stock: 100 },
            { weight: '100g', price: 220, mrp: 380, stock: 60 },
            { weight: '250g', price: 500, mrp: 850, stock: 30 }
        ],
        image: '/products/cinnamon-sticks.png',
        rating: 4.9,
        tags: ['Sweet Spice', 'Bakery']
    },
];
