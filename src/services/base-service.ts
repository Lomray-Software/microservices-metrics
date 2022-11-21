import ResolveSrv from '@helpers/resolve-srv';

/**
 * Base methods
 */
class BaseService {
  /**
   * @private
   */
  private static cachedConnections = {};

  /**
   * Return connection string or resolve SRV record and return connection string.
   * @protected
   */
  protected static async getConnection(connection: string, isSRV = false): Promise<string> {
    if (isSRV) {
      if (this.cachedConnections[connection]) {
        return this.cachedConnections[connection];
      }

      return (this.cachedConnections[connection] = await ResolveSrv(connection));
    }

    return connection;
  }

  /**
   * Clear cache
   * @protected
   */
  protected static clearCache(): void {
    this.cachedConnections = {};
  }
}

export default BaseService;
