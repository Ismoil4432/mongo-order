import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginAdminDto, res: Response) {
    const { user_name, password } = loginUserDto;
    const user = await this.adminModel.findOne({ user_name });
    if (!user) {
      throw new UnauthorizedException('User not registered');
    }
    const isMatchPass = await bcrypt.compare(password, user.hashed_password);
    if (!isMatchPass) {
      throw new UnauthorizedException('User not registered(pass)');
    }
    const tokens = await this.getTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.adminModel.findByIdAndUpdate(
      user.id,
      {
        hashed_token: hashed_refresh_token,
      },
      { new: true },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'User logged in',
      user: updatedUser,
      tokens,
    };
    return response;
  }

  async registration(createAdminDto: CreateAdminDto, res: Response) {
    const { user_name, email, password } = createAdminDto;
    const user = await this.adminModel.findOne({ user_name });
    const userEmail = await this.adminModel.findOne({ email });
    if (user) {
      throw new BadRequestException('Username already exists!');
    }
    if (userEmail) {
      throw new BadRequestException('Email already registered!');
    }
    const hashed_password = await bcrypt.hash(password, 7);
    const newUser = await this.adminModel.create({
      ...createAdminDto,
      hashed_password,
    });
    const tokens = await this.getTokens(newUser);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.adminModel.findByIdAndUpdate(
      newUser.id,
      {
        hashed_token: hashed_refresh_token,
      },
      { new: true },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'User registered',
      user: updatedUser,
      tokens,
    };
    return response;
  }

  async logout(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException('User not found');
    }
    const updateUser = await this.adminModel.findByIdAndUpdate(
      userData.id,
      { hashed_token: null },
      { new: true },
    );
    res.clearCookie('refresh_token');
    const response = {
      message: 'User logged out successfully',
      user: updateUser,
    };
    return response;
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { old_password, new_password, confirm_password } = updatePasswordDto;
    let user: any;
    try {
      user = await this.adminModel.findById(id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
    const isMatchPass = await bcrypt.compare(
      old_password,
      user.hashed_password,
    );
    if (!isMatchPass) {
      throw new UnauthorizedException('Old password is wrong');
    }
    if (new_password != confirm_password) {
      throw new UnauthorizedException('Passwords do not match');
    }
    const hashed_password = await bcrypt.hash(new_password, 7);
    return this.adminModel.findByIdAndUpdate(
      id,
      { hashed_password },
      { new: true },
    );
  }

  async create(createAdminDto: CreateAdminDto, res: Response) {
    const { user_name, email, password } = createAdminDto;
    const user = await this.adminModel.findOne({ user_name });
    const userEmail = await this.adminModel.findOne({ email });
    if (user) {
      throw new UnauthorizedException('Username already exists');
    }
    if (userEmail) {
      throw new BadRequestException('Email already registered!');
    }
    const hashed_password = await bcrypt.hash(password, 7);
    const createdAdmin = await this.adminModel.create({
      ...createAdminDto,
      hashed_password,
    });
    const tokens = await this.getTokens(createdAdmin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.adminModel.findByIdAndUpdate(
      createdAdmin.id,
      {
        hashed_token: hashed_refresh_token,
      },
      { new: true },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'User created',
      user: updatedUser,
      tokens,
    };
    return response;
  }

  async getTokens(admin: any) {
    const jwtPayload = {
      id: admin.id,
      is_active: admin.is_creator,
      is_owner: admin.is_active,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async findOneById(id: string) {
    let user: any;
    try {
      user = await this.adminModel.findById(id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async findOneByUserName(user_name: string): Promise<Admin> {
    return this.adminModel.findOne({ user_name }).exec();
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    return this.adminModel
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.adminModel.findByIdAndDelete(id).exec();
  }
}
