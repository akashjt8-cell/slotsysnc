import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
@Module({ imports: [HealthModule, RealtimeModule] })
export class AppModule {}
