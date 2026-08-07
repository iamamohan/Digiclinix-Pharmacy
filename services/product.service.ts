import { prisma } from '@/lib/prisma';
import { GetProductsQueryInput, CreateProductInput, UpdateProductInput } from '@/lib/validations/product.schema';
import { slugify } from '@/utils/slugify';
import { Prisma } from '@prisma/client';

function serializeProduct(product: Prisma.ProductGetPayload<{}>) {
  return {
    ...product,
    price: product.price.toString(),
  };
}

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

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }),
      },
    });

    return serializeProduct(product);
  },

  async remove(id: string) {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return false;

    await prisma.product.delete({ where: { id } });
    return true;
  },
};
