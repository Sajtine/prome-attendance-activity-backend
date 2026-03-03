import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Check all admins
  @Get()
  getAdmin() {
    return this.adminService.getAdmin();
  }

  // Admin login
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const admin = await this.adminService.login(body.username, body.password);
    if (!admin) {
      return { success: false, message: 'Invalid Credentials' };
    }

    return { success: true, admin };
  }
}
