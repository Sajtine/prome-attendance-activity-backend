import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertAttendanceDto } from './dto/insert-attendance.dto';
import { AttendanceGateway } from './attendance.gateway';
import { nanoid } from 'nanoid';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private attendanceGateway: AttendanceGateway,
  ) {}

  // createAttendance(dto: InsertAttendanceDto) {
  //   return this.prisma.attendance.create({
  //     data: dto,
  //   });
  // }

  // With websocket broadcasting
  async createAttendance(dto: InsertAttendanceDto) {
    const random_RefId = nanoid(10);
    const created = await this.prisma.attendance.create({
      data: {
        ref_id: random_RefId,
        fullname: dto.fullname,
        schedule: dto.schedule,
      },
    });

    this.attendanceGateway.server.emit('attendance_create', {
      type: 'create',
      data: created,
    });

    return created;
  }

  // Get all attendance records
  getAttendance() {
    return this.prisma.attendance.findMany({
      select: {
        id: true,
        fullname: true,
        ref_id: true,
        schedule: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Get attendance records by schedule
  getAttendanceBySched(schedule: string) {
    return this.prisma.attendance.findMany({
      select: {
        id: true,
        fullname: true,
        ref_id: true,
        schedule: true
      },
      where: {
        schedule: schedule,
      },
    });
  }

  // Get a single attendance record by ID
  async getAttendanceById(id: number) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new BadRequestException(`Attendance with id ${id} not found`);
    }

    return attendance;
  }

  //get user by unique reference id
  async getUserByRefId(ref_id: string) {
    if (!ref_id?.trim()) {
      throw new BadRequestException('REFERENCE ID IS REQUIRED');
    }
    const attendee = await this.prisma.attendance.findFirst({
      where: { ref_id },
    });
    return attendee;
  }

  // updateAttendance(id: number, data: { fullname: string; schedule: string }) {
  //   return this.prisma.attendance.update({
  //     where: { id },
  //     data,
  //   });
  // }

  // With websocket broadcasting
  async updateAttendance(
    id: number,
    data: { fullname: string; schedule: string },
  ) {
    const updated = await this.prisma.attendance.update({
      where: { id },
      data,
    });

    console.log('Broadcasting attendance_update:', updated);
    this.attendanceGateway.server.emit('attendance_update', {
      type: 'update',
      data: updated,
    });

    return updated;
  }

  async getSearchResult(input: string) {
    const search = input?.trim();

    if (!search) return []; // prevents returning everything on empty input

    try {
      return await this.prisma.attendance.findMany({
        where: {
          OR: [
            {
              fullname: { contains: search, mode: 'insensitive' },
            },
            {
              ref_id: { contains: search, mode: 'insensitive' },
            },
            {
              schedule: { contains: search, mode: 'insensitive' },
            },
          ],
        },
        orderBy: { id: 'asc' },
      });
    } catch (error) {
      console.error('Error in getSearchResult:', error);
      throw new Error('Failed to fetch search results');
    }
  }
}
