/**
 * Utility to handle database operations safely in development
 * Returns mock data when database is not available
 */

// Mock data for products
const mockProducts = [
  {
    _id: "mock-product-1",
    title: "Smartphone XYZ",
    slug: "smartphone-xyz",
    description: "Latest smartphone with advanced features",
    price: 599.99,
    discountPrice: 499.99,
    stock: 25,
    category: {
      _id: "mock-category-1",
      name: "Electronics",
      slug: "electronics"
    },
    subcategory: {
      _id: "mock-subcategory-1",
      name: "Mobile Phones",
      slug: "mobile-phones"
    },
    images: [],
    videos: [],
    tags: ["smartphone", "mobile", "electronics"],
    isActive: true,
    isFeatured: true,
    sku: "SP-XYZ-001",
    color: ["Black", "White"],
    genericName: "Smartphone",
    countryOfOrigin: "China",
    manufacturerName: "TechCorp",
    createdBy: "mock-admin-id",
    gstSlab: 18,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "mock-product-2",
    title: "Laptop ABC",
    slug: "laptop-abc",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    discountPrice: 1199.99,
    stock: 15,
    category: {
      _id: "mock-category-1",
      name: "Electronics",
      slug: "electronics"
    },
    subcategory: {
      _id: "mock-subcategory-2",
      name: "Laptops",
      slug: "laptops"
    },
    images: [],
    videos: [],
    tags: ["laptop", "computer", "electronics"],
    isActive: true,
    isFeatured: true,
    sku: "LP-ABC-001",
    color: ["Silver", "Black"],
    genericName: "Laptop",
    countryOfOrigin: "USA",
    manufacturerName: "CompTech",
    createdBy: "mock-admin-id",
    gstSlab: 18,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "mock-product-3",
    title: "T-Shirt Premium",
    slug: "t-shirt-premium",
    description: "Comfortable cotton t-shirt",
    price: 29.99,
    discountPrice: 24.99,
    stock: 100,
    category: {
      _id: "mock-category-2",
      name: "Clothing",
      slug: "clothing"
    },
    subcategory: {
      _id: "mock-subcategory-3",
      name: "T-Shirts",
      slug: "t-shirts"
    },
    images: [],
    videos: [],
    tags: ["clothing", "t-shirt", "cotton"],
    isActive: true,
    isFeatured: false,
    sku: "TS-PRM-001",
    color: ["Red", "Blue", "Green"],
    genericName: "T-Shirt",
    countryOfOrigin: "India",
    manufacturerName: "FashionHub",
    createdBy: "mock-seller-id",
    gstSlab: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock data for categories
const mockCategories = [
  {
    _id: "mock-category-1",
    name: "Electronics",
    slug: "electronics",
    img_url: "https://ik.imagekit.io/bulkwala/Banner/Electronics.png",
    banner: [],
    subcategories: [
      {
        _id: "mock-subcategory-1",
        name: "Mobile Phones",
        slug: "mobile-phones"
      },
      {
        _id: "mock-subcategory-2",
        name: "Laptops",
        slug: "laptops"
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "mock-category-2",
    name: "Clothing",
    slug: "clothing",
    img_url: "https://ik.imagekit.io/bulkwala/Banner/Clothing.png",
    banner: [],
    subcategories: [
      {
        _id: "mock-subcategory-3",
        name: "T-Shirts",
        slug: "t-shirts"
      },
      {
        _id: "mock-subcategory-4",
        name: "Jeans",
        slug: "jeans"
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * Safely execute database operations with fallback to mock data
 * @param {Function} dbOperation - Database operation to execute
 * @param {*} mockData - Mock data to return if DB operation fails
 * @param {string} operationName - Name of the operation for logging
 * @returns {Promise<*>} Result of DB operation or mock data
 */
export const safeDbOperation = async (dbOperation, mockData, operationName = "Database Operation") => {
  try {
    return await dbOperation();
  } catch (error) {
    console.warn(`⚠️ ${operationName} failed:`, error.message);
    console.warn("💡 Returning mock data due to database connectivity issues");
    return mockData;
  }
};

/**
 * Get mock products with filtering support
 */
export const getMockProducts = (filters = {}) => {
  let filteredProducts = [...mockProducts];
  
  // Apply filters
  if (filters.category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category._id === filters.category || p.category.slug === filters.category
    );
  }
  
  if (filters.subcategory) {
    filteredProducts = filteredProducts.filter(p => 
      p.subcategory._id === filters.subcategory || p.subcategory.slug === filters.subcategory
    );
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  if (filters.minPrice || filters.maxPrice) {
    filteredProducts = filteredProducts.filter(p => {
      const price = p.discountPrice || p.price;
      return (
        (!filters.minPrice || price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || price <= Number(filters.maxPrice))
      );
    });
  }
  
  // Pagination
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;
  
  const paginatedProducts = filteredProducts.slice(skip, skip + limit);
  
  return {
    products: paginatedProducts,
    total: filteredProducts.length,
    page,
    limit
  };
};

/**
 * Get mock categories
 */
export const getMockCategories = () => {
  return mockCategories;
};

/**
 * Get a single mock product by slug
 */
export const getMockProductBySlug = (slug) => {
  return mockProducts.find(p => p.slug === slug) || null;
};

/**
 * Get a single mock category by slug
 */
export const getMockCategoryBySlug = (slug) => {
  return mockCategories.find(c => c.slug === slug) || null;
};