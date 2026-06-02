/**
 * Custom Headers for CodePen API requests.
 */
export default class CodePenApiRequestHeaders extends Headers {
  /**
   * A fixed CSRF token to simulate requests from an anonymous user
   */
  protected static readonly ANONYMOUS_USER_CSRF_TOKEN = 'OIHIb24mnHGF1w-X5WKfnE4oN-dM5q_iPR8Eaaj3MChgT1Uu8724bHmweCZ4BHV3PxFFsXvCUGiVX4ZvZVHIuQ';
  /**
   * A fixed Cookie values to simulate requests from an anonymous user
   */
  protected static readonly ANONYMOUS_USER_COOKIE = 'cp_session=xYNQ0AYZFVe6gwmZ--C21egLLUCutj6kat7A42d23sbU8ux9r9Rl088EFJR61SJEzhTZCVgk5JM%2BNXsKf9EmTWAorHZiEmuJVyFH2eDVHRuQIbHiaM5OCROgz4di9BWQN732jvOCw0z18zBfuj1BKCpKPc7w7TSBTycAq08EL%2F%2BZx8vwqZ%2B49uu%2B3vlkmPFJwOX06DAJWcX98p1LyHRNM1MiXXvZWC--auA%2FeEelrd2iEuAYu65V9A%3D%3D';

  constructor() {
    super();
  }

  public async setup (): Promise<void> {
    this.setupDefaultHeaders();
    this.setupAnonymousUserCsrfHeaders();

    // Keep return async for compatibility
    return Promise.resolve();
  }

  protected setupDefaultHeaders (): void {
    this.set('Accept', '*/*');
    this.set('Content-Type', 'application/json');
    this.set('X-Requested-With', 'XMLHttpRequest');
  }

  /**
   * Setup headers to bypass CSRF protection
   */
  protected setupAnonymousUserCsrfHeaders (): void {
    this.set('X-Csrf-Token', CodePenApiRequestHeaders.ANONYMOUS_USER_CSRF_TOKEN);
    this.set('Cookie', CodePenApiRequestHeaders.ANONYMOUS_USER_COOKIE);
  }
}
