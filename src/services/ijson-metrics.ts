import { Counter, metrics, ValueType } from '@opentelemetry/api';
import axios from 'axios';
import { MS_CONNECTION, MS_CONNECTION_SRV } from '@constants/index';
import BaseService from '@services/base-service';

interface IWorkerInfo {
  name: string;
  params: {
    workers: number;
    clients: number;
  };
}

interface IJsonInfo {
  request: number;
  call: number;
  result: number;
  send: number;
  recv: number;
  io_event: number;
}

interface IJsonMetricState {
  workers: IWorkerInfo[];
  events: IWorkerInfo[];
}

/**
 * Collect metrics from ijson
 */
class IjsonMetrics extends BaseService {
  /**
   * @private
   */
  private channelMsPrefix = 'ms';

  /**
   * @private
   */
  private eventsMsPrefix = 'events';

  /**
   * Store previous values
   * @private
   */
  private prevState = {
    request: 0,
    send: 0,
    recv: 0,
    // eslint-disable-next-line camelcase
    io_event: 0,
  };

  /**
   * Store queue info
   * @private
   */
  private state: IJsonMetricState = {
    workers: [],
    events: [],
  };

  private infoRequests: Counter;
  private infoSend: Counter;
  private infoRecv: Counter;
  private infoIoEvents: Counter;

  /**
   * @constructor
   */
  private createMetrics() {
    const meter = metrics.getMeter('opentelemetry-ijson-stats', '1.0.0');

    this.infoRequests = meter.createCounter('queue.requests.total', {
      description: 'total ijson queue requests',
      valueType: ValueType.INT,
    });
    this.infoSend = meter.createCounter('queue.requests.send', {
      description: 'total ijson queue send',
      valueType: ValueType.INT,
    });
    this.infoRecv = meter.createCounter('queue.requests.recv', {
      description: 'total ijson queue recv',
      valueType: ValueType.INT,
    });
    this.infoIoEvents = meter.createCounter('queue.requests.io_events', {
      description: 'total ijson queue io events',
      valueType: ValueType.INT,
    });

    Object.keys(this.state).forEach((type) => {
      meter
        .createObservableGauge(`queue.${type}.size`, {
          description: `ijson ${type} size`,
          valueType: ValueType.INT,
        })
        .addCallback((observableResult) => {
          this.state[type].forEach(({ name, params }: IWorkerInfo) => {
            Object.entries(params).forEach(([param, keyValue]) => {
              observableResult.observe(keyValue, {
                microservice: name,
                type,
                param,
              });
            });
          });
        });
    });
  }

  /**
   * Send general metrics
   * @private
   */
  private sendInfo(info: IJsonInfo): void {
    const { request, send, recv, io_event: ioEvent } = info;

    this.infoRequests.add(request - this.prevState.request);
    this.infoSend.add(send - this.prevState.send);
    this.infoRecv.add(recv - this.prevState.recv);
    this.infoIoEvents.add(ioEvent - this.prevState.io_event);

    this.prevState = info;
  }

  /**
   * Collect metrics and sent to opentelemetry collector
   */
  public collect = async (): Promise<void> => {
    try {
      const ijsonUrl = await IjsonMetrics.getConnection(MS_CONNECTION, MS_CONNECTION_SRV);
      const { data } = await axios.request<Record<string, IWorkerInfo['params']>>({
        url: `${ijsonUrl}/rpc/details`,
      });

      if (!data?.$info) {
        console.info('Empty RPC details');

        return;
      }

      const info = data.$info as unknown as IJsonInfo;

      // normalize workers info, separate ms and event workers
      const { msWorkersInfo, eventsWorkersInfo } = Object.entries(data ?? {}).reduce(
        (res, [channel, { workers, clients }]) => {
          if (channel.startsWith(`${this.channelMsPrefix}/`)) {
            res.msWorkersInfo.push({
              name: channel.replace(`${this.channelMsPrefix}/`, ''),
              params: { workers, clients },
            });
          } else if (channel.startsWith(`${this.eventsMsPrefix}/`)) {
            res.eventsWorkersInfo.push({
              name: channel.replace(`${this.channelMsPrefix}/`, ''),
              params: { workers, clients },
            });
          }

          return res;
        },
        { msWorkersInfo: [], eventsWorkersInfo: [] } as {
          msWorkersInfo: IWorkerInfo[];
          eventsWorkersInfo: IWorkerInfo[];
        },
      );

      this.state = {
        workers: msWorkersInfo,
        events: eventsWorkersInfo,
      };

      this.sendInfo(info);
    } catch (e) {
      console.info('Failed to get ijson details:', e);

      IjsonMetrics.clearCache();
    }
  };

  /**
   * Start collect metrics
   */
  public start(): void {
    this.createMetrics();
    this.obtain();
  }

  /**
   * Obtain metrics by interval
   * @private
   */
  private obtain(): void {
    setTimeout(() => {
      void this.collect().then(() => {
        this.obtain();
      });
    }, 1000);
  }
}

export default IjsonMetrics;
