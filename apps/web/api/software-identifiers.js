export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Use GET.' });
  }

  const keyword = typeof request.query?.keyword === 'string' ? request.query.keyword.trim() : '';
  if (keyword.length < 2 || keyword.length > 80 || !/^[\p{L}\p{N} .+_-]+$/u.test(keyword)) {
    return response.status(400).json({ error: 'Enter a software name between 2 and 80 characters.' });
  }

  const query = new URLSearchParams({ keywordSearch: keyword, resultsPerPage: '10' });
  try {
    const upstream = await fetch('https://services.nvd.nist.gov/rest/json/cpes/2.0?' + query, {
      signal: AbortSignal.timeout(8000),
      redirect: 'error',
    });
    if (!upstream.ok) {
      const limited = upstream.status === 429;
      return response.status(limited ? 429 : 502).json({ error: limited ? 'NIST rate limit reached. Try again later.' : 'NIST lookup is temporarily unavailable.' });
    }
    const body = await upstream.json();
    if (!Number.isSafeInteger(body?.totalResults) || body.totalResults < 0 ||
        !Array.isArray(body.products) || body.products.length > 10 ||
        body.products.some(item => typeof item?.cpe?.cpeName !== 'string' || typeof item.cpe.deprecated !== 'boolean')) {
      return response.status(502).json({ error: 'NIST returned an unexpected response.' });
    }
    const products = body.products.map(({ cpe }) => ({
      identifier: cpe.cpeName,
      deprecated: cpe.deprecated,
      title: Array.isArray(cpe.titles) ? cpe.titles.find(item => item?.lang === 'en' && typeof item.title === 'string')?.title : undefined,
    }));
    response.setHeader('Cache-Control', 'public, s-maxage=300');
    return response.status(200).json({ products, total: body.totalResults });
  } catch {
    return response.status(502).json({ error: 'NIST lookup is temporarily unavailable.' });
  }
}
