const ENVIRONMENT = process.env.ENVIRONMENT || 'prod';
const MS_CONNECTION = process.env.MS_CONNECTION || 'http://127.0.0.1:8001';
// eslint-disable-next-line @typescript-eslint/naming-convention
const MS_CONNECTION_SRV = Boolean(process.env.MS_CONNECTION_SRV) || false;
const MS_OPENTELEMETRY_OTLP_URL = process.env.MS_OPENTELEMETRY_OTLP_URL || 'http://127.0.0.1:4318';
// eslint-disable-next-line @typescript-eslint/naming-convention
const MS_OPENTELEMETRY_OTLP_URL_SRV = Boolean(
  Number(process.env.MS_OPENTELEMETRY_OTLP_URL_SRV || 0),
);
const MS_OPENTELEMETRY_DEBUG = Number(process.env.MS_OPENTELEMETRY_DEBUG || 0);

export {
  ENVIRONMENT,
  MS_CONNECTION,
  MS_CONNECTION_SRV,
  MS_OPENTELEMETRY_OTLP_URL,
  MS_OPENTELEMETRY_OTLP_URL_SRV,
  MS_OPENTELEMETRY_DEBUG,
};
