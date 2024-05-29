interface QueryParams {
  [key: string]: string;
}

export const deserializeSearchParams = (
  searchParams: URLSearchParams
): QueryParams => {
  const queryParams: QueryParams = {};

  for (const [key, value] of searchParams.entries()) {
    queryParams[key] = value;
  }

  return queryParams;
};
