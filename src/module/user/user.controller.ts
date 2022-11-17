import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { CartService } from '../cart/cart.service';
import { Role } from './enum/role.enum';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  getAllUser() {
    return this.userService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('carts')
  getUserCart(@GetUser() user) {
    const userId = user['id'];

    return this.cartService.getUserCart(userId);
  }

  @UseGuards(JwtGuard)
  @Get('carts/total')
  getTotalPriceCart(@GetUser() user) {
    const userId = user['id'];

    return this.cartService.calculateCarts(userId);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // @Roles(Role.USER)
  @UseGuards(RoleGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    console.log(file);
  }

  @UseGuards(JwtGuard)
  @Patch('carts')
  editCartQty(
    @GetUser() user,
    @Body('cart_id') cartId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.editCartQty(user.id, cartId, quantity);
  }

  @UseGuards(JwtGuard)
  @Delete('carts')
  deleteAllUserCarts(@GetUser() user) {
    return this.cartService.removeAllUserCarts(user.id);
  }
}
