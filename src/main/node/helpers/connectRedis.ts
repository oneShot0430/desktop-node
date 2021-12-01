import sdk from 'services/sdk';

export default (redis_ip: string, redis_port: number): void => {
  sdk.koiiTools.loadRedisClient({
    redis_ip,
    redis_port
  });
};
