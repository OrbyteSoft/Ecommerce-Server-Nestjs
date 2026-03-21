import { CacheModule } from '@nestjs/cache-manager';
import { Module, Global } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          url: 'redis://default:9ATZoXL9hpDwiT1XgkQ6347mJvQ1NTI7@redis-17146.crce182.ap-south-1-1.ec2.cloud.redislabs.com:17146',
          ttl: 600000,
        }),
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
