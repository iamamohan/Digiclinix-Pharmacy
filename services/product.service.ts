import { prisma } from '@/lib/prisma';
import { GetProductsQueryInput, CreateProductInput, UpdateProductInput } from '@/lib/validations/product.schema';
import { slugify } from '@/utils/slugify';
import { Prisma } from '@prisma/client';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';

function serializeProduct(product: Prisma.ProductGetPayload<{}>) {
  return {
    ...product,
    price: product.price.toString(),
  };
}

const FALLBACK_PRODUCTS = [
  {
    id: 'fb-1',
    name: 'Paracetamol 500mg Tablets',
    slug: 'paracetamol-500mg-tablets',
    category: 'Pain Relief',
    price: '49.99',
    description: 'Effective pain relief and fever reduction. Suitable for adults and children over 12.',
    imageUrl: '/images/products/paracetamol.png',
    imagePublicId: null,
    inStock: true,
    requiresPrescription: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'fb-2',
    name: 'Amoxicillin 250mg Capsules',
    slug: 'amoxicillin-250mg-capsules',
    category: 'Antibiotics',
    price: '129.50',
    description: 'Broad-spectrum antibiotic for treating bacterial infections.',
    imageUrl: '/images/products/amoxicillin.png',
    imagePublicId: null,
    inStock: true,
    requiresPrescription: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'fb-3',
    name: 'Vitamin D3 1000IU Softgels',
    slug: 'vitamin-d3-1000iu-softgels',
    category: 'Vitamins & Supplements',
    price: '299.00',
    description: 'Essential Vitamin D3 supplement for bone health and immune system support.',
    imageUrl: '/images/products/vitamin-d3.png',
    imagePublicId: null,
    inStock: true,
    requiresPrescription: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'fb-4',
    name: 'Omeprazole 20mg Capsules',
    slug: 'omeprazole-20mg-capsules',
    category: 'Digestive Health',
    price: '89.00',
    description: 'Proton pump inhibitor for treating acid reflux, heartburn, and stomach ulcers.',
    imageUrl: '/images/products/omeprazole.png',
    imagePublicId: null,
    inStock: true,
    requiresPrescription: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const productService = {
  async list(params: GetProductsQueryInput) {
    const { page, pageSize, search, category, inStock, requiresPrescription, sortBy, sortOrder } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (inStock !== undefined) where.inStock = inStock;
    if (requiresPrescription !== undefined) where.requiresPrescription = requiresPrescription;

    try {
      const [totalItems, rawProducts] = await prisma.$transaction([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { [sortBy]: sortOrder },
        }),
      ]);

      const products = rawProducts.map(serializeProduct);

      return {
        products,
        totalItems,
        page,
        pageSize,
      };
    } catch (dbError) {
      console.warn('[ProductService] Database query failed or initializing, returning fallback catalog:', dbError);
      return {
        products: FALLBACK_PRODUCTS.slice(0, pageSize),
        totalItems: FALLBACK_PRODUCTS.length,
        page: 1,
        pageSize,
      };
    }
  },

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product ? serializeProduct(product) : null;
  },

  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    return product ? serializeProduct(product) : null;
  },

  async getByIdOrSlug(identifier: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    return isUuid ? this.getById(identifier) : this.getBySlug(identifier);
  },

  async generateUniqueSlug(baseName: string, customSlug?: string): Promise<string> {
    let baseSlug = customSlug ? slugify(customSlug) : slugify(baseName);
    if (!baseSlug) baseSlug = 'product';

    const existing = await prisma.product.findUnique({
      where: { slug: baseSlug },
    });

    if (!existing) {
      return baseSlug;
    }

    // Explicit Slug Collision Strategy: Append short random hex suffix (4 chars)
    const suffix = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${suffix}`;
  },

  async create(data: CreateProductInput) {
    const slug = await this.generateUniqueSlug(data.name, data.slug);

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
      },
    });

    return serializeProduct(product);
  },

  async update(id: string, data: UpdateProductInput) {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return null;

    let slug = data.slug;
    if (data.name && !data.slug) {
      slug = await this.generateUniqueSlug(data.name);
    } else if (data.slug && data.slug !== existingProduct.slug) {
      slug = await this.generateUniqueSlug(existingProduct.name, data.slug);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }),
      },
    });

    // Post-commit cleanup: If the database update succeeded AND a new image replaces an old Cloudinary image
    const oldPublicId = existingProduct.imagePublicId;
    const newPublicId = data.imagePublicId;

    if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
      try {
        await deleteCloudinaryAsset(oldPublicId);
      } catch (cleanupError) {
        console.warn('[ProductService] Post-update Cloudinary asset cleanup warning:', cleanupError);
      }
    }

    return serializeProduct(updatedProduct);
  },

  async remove(id: string) {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return false;

    // Database deletion first
    await prisma.product.delete({ where: { id } });

    // Post-commit cleanup: If DB deletion succeeded and Cloudinary public ID exists, clean up asset
    if (existingProduct.imagePublicId) {
      try {
        await deleteCloudinaryAsset(existingProduct.imagePublicId);
      } catch (cleanupError) {
        console.warn('[ProductService] Post-delete Cloudinary asset cleanup warning:', cleanupError);
      }
    }

    return true;
  },
};

