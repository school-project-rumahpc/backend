import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Role } from '../user/enum/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
