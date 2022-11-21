import IjsonMetrics from '@services/ijson-metrics';
import OpentelemetryConfig from '@services/opentelemetry-config';

/**
 * Start service
 */
const run = async (): Promise<void> => {
  await OpentelemetryConfig.init();

  const ijsonService = new IjsonMetrics();

  ijsonService.start();

  console.info('Microservices metric collector started.');
};

export default run();
