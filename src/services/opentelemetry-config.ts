import { diag, DiagConsoleLogger, DiagLogLevel, metrics } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  ENVIRONMENT,
  MS_OPENTELEMETRY_DEBUG,
  MS_OPENTELEMETRY_OTLP_URL,
  MS_OPENTELEMETRY_OTLP_URL_SRV,
} from '@constants/index';
import BaseService from '@services/base-service';

/**
 * Initialize opentelemetry
 */
class OpentelemetryConfig extends BaseService {
  /**
   * Create metrics provider
   */
  public static async init(): Promise<void> {
    if (MS_OPENTELEMETRY_DEBUG) {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
    }

    const otlpUrl = await OpentelemetryConfig.getConnection(
      MS_OPENTELEMETRY_OTLP_URL,
      MS_OPENTELEMETRY_OTLP_URL_SRV,
    );
    const meterProvider = new MeterProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'ms-metrics',
        environment: ENVIRONMENT,
      }),
    });
    const exporter = new OTLPMetricExporter({ url: `${otlpUrl}/v1/metrics` });
    const metricReader = new PeriodicExportingMetricReader({
      exporter,
      exportIntervalMillis: 1000,
    });

    meterProvider.addMetricReader(metricReader);
    metrics.setGlobalMeterProvider(meterProvider);

    // track srv records changes
    if (MS_OPENTELEMETRY_OTLP_URL_SRV) {
      setInterval(() => {
        OpentelemetryConfig.getConnection(MS_OPENTELEMETRY_OTLP_URL, MS_OPENTELEMETRY_OTLP_URL_SRV)
          .then((url) => {
            exporter['url'] = url;
          })
          .catch((e) => {
            console.log('Failed resolve srv records: ', e);
          });
      }, 30000);
    }
  }
}

export default OpentelemetryConfig;
