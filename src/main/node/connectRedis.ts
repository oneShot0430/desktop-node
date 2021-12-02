import errorHandler from 'main/errorHandler';
import sdk from 'services/sdk';

const connectRedis = (redis_ip: string, redis_port: number): void => {
  sdk.koiiTools.loadRedisClient({
    redis_ip,
    redis_port
  });
};

export default errorHandler(connectRedis, 'Connect Redis error');
