const getRedirectUrl = (url: string) => {
  const decoded = decodeURIComponent(url);
  return decoded?.replace("?callbackUrl=", "");
};

export default getRedirectUrl;
