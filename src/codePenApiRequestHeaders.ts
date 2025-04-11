/**
 * Custom Headers for CodePen API requests.
 */
export default class CodePenApiRequestHeaders extends Headers {
  protected static readonly INDEX_PAGE_URL = 'https://codepen.io/';

  constructor() {
    super();

    // Set default headers
    this.set('Accept', '*/*');
    this.set('Content-Type', 'application/json');
    this.set('X-Requested-With', 'XMLHttpRequest');
  }

  /**
   * Setup CSRF headers for subsequent API requests.
   *
   * This method sends a request to the CodePen index page
   * to retrieve the CSRF token and cookie.
   */
  public async setupCsrfHeaders (): Promise<void> {
    const response = await this.sendRequestToIndex();
    const csrfToken = await this.findCsrfToken(response);
    const csrfCookie = this.findCsrfCookie(response);

    this.set('X-Csrf-Token', csrfToken);
    this.set('Cookie', csrfCookie);

    return;
  }

  protected async sendRequestToIndex (): Promise<Response> {
    // Headers to open index page
    const headers = {
      'Accept': 'text/html',
      'Upgrade-Insecure-Requests': '1',
    };

    return await fetch(CodePenApiRequestHeaders.INDEX_PAGE_URL, { headers });
  }

  protected async findCsrfToken (response: Response): Promise<string> {
    const html = await response.text();
    const [, token] = (/<meta name="csrf-token"\s+content="([^"]+)"/.exec(html)) ?? [];

    if (!token) {
      throw new Error('CSRF token not found');
    }

    return token;
  }

  protected findCsrfCookie (response: Response): string {
    const cookieName = 'cp_session';
    const cookieHeader = response.headers.get('set-cookie')?.split(',') ?? [];
    const cookie = cookieHeader.find(cookie => cookie.startsWith(`${cookieName}=`))?.split(';')[0];

    if (!cookie) {
      throw new Error('CSRF cookie not found');
    }

    return cookie;
  }
}
