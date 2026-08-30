import { Controller, Get, UseGuards } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('probe')
@UseGuards(JwtAuthGuard)
class ProbeController {
  @Get()
  ok() {
    return { ok: true };
  }
}

describe('JwtAuthGuard', () => {
  it('resolves AuthModuleOptions in a feature module', async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ProbeController],
    }).compile();

    expect(module.get(JwtAuthGuard)).toBeDefined();
    await module.close();
  });
});
