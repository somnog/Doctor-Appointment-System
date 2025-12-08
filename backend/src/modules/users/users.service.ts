import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.prismaService.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const userData = {
      ...createUserDto,
      dateOfBirth: createUserDto.dateOfBirth
        ? new Date(createUserDto.dateOfBirth)
        : undefined,
    };

    return this.prismaService.prisma.user.create({
      data: userData,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.prisma.user.findMany({
      include: {
        doctorProfile: true,
        appointments: true,
      },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prismaService.prisma.user.findUnique({
      where: { id },
      include: {
        doctorProfile: true,
        appointments: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.prisma.user.findUnique({
      where: { email },
      include: {
        doctorProfile: true,
        appointments: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    await this.findOne(id);

    // If email is being updated, check if new email already exists
    if (updateUserDto.email) {
      const existingUser = await this.prismaService.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updateData: any = { ...updateUserDto };
    
    if (updateUserDto.dateOfBirth !== undefined) {
      updateData.dateOfBirth = new Date(updateUserDto.dateOfBirth);
    } else {
      delete updateData.dateOfBirth;
    }

    return this.prismaService.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<void> {
    // Check if user exists
    await this.findOne(id);

    await this.prismaService.prisma.user.delete({
      where: { id },
    });
  }
}
