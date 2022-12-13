import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from '../category/entity/category.entity';
import {
  CreateProductDetailsDto,
  CreateProductDto,
  UpdateProductDetailsDto,
  UpdateProductDto,
} from './dto';
import { Details, Products } from './entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Products) private productRepository: Repository<Products>,
    @InjectRepository(Details) private detailsRepository: Repository<Details>,
  ) {}

  findAllProducts() {
    return this.productRepository.find({
      relations: ['category', 'details'],
    });
  }

  async filterProducts(search: string, price: any) {
    const products = await this.productRepository.find({
      relations: ['category', 'details'],
      where: search ? { name: ILike(`%${search}%`) } : null,
      order: price ? { price: `${price}` } : null,
    });

    if (!products.length) throw new NotFoundException('Product Not Found');
    return products;
  }

  async filterProductDate(date: any) {
    return await this.productRepository.find({
      order: { createdAt: `${date}`, updatedAt: `${date}` },
      relations: ['category', 'details'],
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'details'],
    });

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    return product;
  }

  findAllDetails() {
    return this.detailsRepository.find({
      select: { product: { id: true, name: true } },
      relations: ['product'],
    });
  }

  async create(dto: CreateProductDto, category: Category) {
    // check product in database
    const productInDb = await this.productRepository.findOne({
      where: [{ id: dto.id }, { name: dto.name }],
    });

    if (productInDb)
      throw new BadRequestException('Product has already exists');

    // Creating Product
    const newProduct = await this.productRepository.save(dto);

    category.products = [...category.products, newProduct];
    await this.categoryRepository.save(category);

    return { message: 'Create product success!' };
  }

  async createDetails(dto: CreateProductDetailsDto, product: Products) {
    const details = this.detailsRepository.create(dto);

    details.product = product;
    await this.detailsRepository.save(details);
    product.details = details;
    await this.productRepository.save(product);

    return { message: 'Create product details success!' };
  }

  async updateProduct(
    id: string,
    { name, stock, price, images, category_id }: UpdateProductDto,
  ) {
    const category = await this.categoryRepository.findOne({
      where: { id: category_id },
      relations: ['products'],
    });

    await this.productRepository.update(id, {
      name,
      stock,
      price,
      images,
      category,
    });
    return {
      message: 'Update success',
    };
  }

  async updateProductDetails(
    id: string,
    {
      processor,
      motherboard,
      memory,
      storage,
      graphics,
      psu,
      casing,
      display,
    }: UpdateProductDetailsDto,
  ) {
    await this.detailsRepository.update(id, {
      processor,
      motherboard,
      memory,
      storage,
      graphics,
      psu,
      casing,
      display,
    });
    return {
      message: 'Update success',
    };
  }

  async deleteProduct(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: `Product with id: ${id} has deleted` };
  }
}
