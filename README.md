# NodeJS Microservices metrics for [microservices](https://github.com/Lomray-Software/microservices)

![GitHub](https://img.shields.io/github/license/Lomray-Software/microservices-metrics)
![GitHub package.json dependency version (dev dep on branch)](https://img.shields.io/github/package-json/dependency-version/Lomray-Software/microservices-metrics/dev/typescript/staging)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=microservices-metrics&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=microservices-metrics)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=microservices-metrics&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=microservices-metrics)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=microservices-metrics&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=microservices-metrics)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=microservices-metrics&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=microservices-metrics)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=microservices-metrics&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=microservices-metrics)

Staging: [![Build staging](https://github.com/Lomray-Software/microservices-metrics/actions/workflows/release.yml/badge.svg?branch=staging)](https://github.com/Lomray-Software/microservices-metrics/actions/workflows/release.yml)   
Prod: [![Build prod](https://github.com/Lomray-Software/microservices-metrics/actions/workflows/release.yml/badge.svg?branch=prod)](https://github.com/Lomray-Software/microservices-metrics/actions/workflows/release.yml)

## Navigation
- [ENVIRONMENTS](#environments)

### ENVIRONMENTS:
- `ENVIRONAMENT` - Running environment. Default: `prod`
- `MS_CONNECTION` - Invert json host and port (with protocol). Default: `http://127.0.0.1:8001`
- `MS_CONNECTION_SRV` - Invert json connection it is SRV record. Default: `false`
- `MS_OPENTELEMETRY_OTLP_URL` - Custom opentelemetry OTLP exporter URL. Default: `http://127.0.0.1:4318`
- `MS_OPENTELEMETRY_OTLP_URL_SRV` - Custom opentelemetry OTLP URL it is SRV record. Default: `0`
- `MS_OPENTELEMETRY_DEBUG` - Enable debug log opentelemetry. Default: `0`
