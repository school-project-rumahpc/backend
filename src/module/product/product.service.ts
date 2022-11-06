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
  CreateImageDto,
  CreateProductDetailsDto,
  CreateProductDto,
  UpdateImageDto,
  UpdateProductDetailsDto,
  UpdateProductDto,
} from './dto';
import { Details, Images, Products } from './entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Products) private productRepository: Repository<Products>,
    @InjectRepository(Details) private detailsRepository: Repository<Details>,
    @InjectRepository(Images) private imagesRepository: Repository<Images>,
  ) {}

  findAllProducts() {
    return this.productRepository.find({
      relations: ['category', 'details', 'images'],
    });
  }

  async filterProducts(search: string, price: any) {
    const products = await this.productRepository.find({
      relations: ['category', 'details', 'images'],
      where: search ? { product_name: ILike(`%${search}%`) } : null,
      order: price ? { price: `${price}` } : null,
    });

    if (!products.length) throw new NotFoundException('Product Not Found');
    return products;
  }

  async filterProductDate(date: any) {
    return await this.productRepository.find({
      order: { created_at: `${date}`, updated_at: `${date}` },
      relations: ['category', 'details', 'images'],
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'details', 'images'],
    });

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    return product;
  }

  findAllDetails() {
    return this.detailsRepository.find({
      relations: ['product'],
    });
  }

  findAllImages() {
    return this.imagesRepository.find({
      order: { id: 'ASC' },
      relations: ['product'],
    });
  }

  async create(dto: CreateProductDto, category: Category) {
    // check product in database
    const productInDb = await this.productRepository.findOne({
      where: [{ id: dto.id }, { product_name: dto.product_name }],
    });

    if (productInDb)
      throw new BadRequestException('Product has already exists');

    // Creating Product
    const newProduct = await this.productRepository.save(dto);

    category.products = [...category.products, newProduct];
    await this.categoryRepository.save(category);

    return newProduct;
  }

  async createDetails(dto: CreateProductDetailsDto, product: Products) {
    const details = this.detailsRepository.create(dto);

    details.product = product;
    await this.detailsRepository.save(details);
    product.details = details;
    await this.productRepository.save(product);

    return details;
  }

  async createImages(dto: CreateImageDto, product: Products) {
    const imageInDb = await this.imagesRepository.findOne({
      where: { url: dto.url },
    });
    if (imageInDb) throw new BadRequestException('Image has already exists');

    const image = await this.imagesRepository.save(dto);

    product.images = [...product.images, image];
    await this.productRepository.save(product);

    return image;
  }

  async update(
    id: string,
    { product_name, stock, price, category_id }: UpdateProductDto,
  ) {
    const product = await this.findOne(id);
    const category = await this.categoryRepository.findOne({
      where: { id: category_id },
      relations: ['products'],
    });

    product.product_name = product_name;
    product.stock = stock;
    product.price = price;
    product.category = category;

    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return `Product with id: ${id} has deleted`;
  }

  async updateProductDetails(id: string, dto: UpdateProductDetailsDto) {
    const details = await this.detailsRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    const product = await this.findOne(dto.product_id);

    details.product = product;

    return await this.detailsRepository.save(details);
  }

  async updateImage(id: number, { url, product_id }: UpdateImageDto) {
    const image = await this.imagesRepository.findOneBy({ id });
    const product = await this.findOne(product_id);

    if (!image || !product) throw new NotFoundException();

    image.url = url;
    image.product = product;

    return await this.imagesRepository.save(image);
  }
}
