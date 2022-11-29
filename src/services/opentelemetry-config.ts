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
   * Get metric url
   * @protected
   */
  protected static getMetricUrl(host: string): string {
    return `${host}/v1/metrics`;
  }

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
      false,
    );
    const meterProvider = new MeterProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'ms-metrics',
        environment: ENVIRONMENT,
      }),
    });

    const exporter = new OTLPMetricExporter({ url: this.getMetricUrl(otlpUrl) });
    const metricReader = new PeriodicExportingMetricReader({
      exporter,
      exportIntervalMillis: 1000,
    });

    meterProvider.addMetricReader(metricReader);
    metrics.setGlobalMeterProvider(meterProvider);

    // track srv records changes
    if (MS_OPENTELEMETRY_OTLP_URL_SRV) {
      setInterval(() => {
        OpentelemetryConfig.getConnection(
          MS_OPENTELEMETRY_OTLP_URL,
          MS_OPENTELEMETRY_OTLP_URL_SRV,
          false,
        )
          .then((url) => {
            // @ts-ignore
            exporter['_otlpExporter']['url'] = this.getMetricUrl(url);
          })
          .catch((e) => {
            console.log('Failed resolve srv records: ', e);
          });
      }, 5000);
    }
  }
}

export default OpentelemetryConfig;
