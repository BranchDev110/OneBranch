import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
  baseQuery: fakeBaseQuery(),
  reducerPath: "baseApi",
  endpoints: () => ({}),
});

export { baseApi };
