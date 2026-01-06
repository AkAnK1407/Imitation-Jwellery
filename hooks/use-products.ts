import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  type ProductFilters,
  type ProductListResponse,
} from "@/services/product-service";
import { getCategoryIdBySlug } from "@/services/category-service";

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery<ProductListResponse, Error>({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useProductsInfinite = (
  filters: Omit<ProductFilters, "page" | "limit" | "categoryId"> = {}
) => {
  return useInfiniteQuery<ProductListResponse, Error>({
    queryKey: ["products", "infinite", filters],

    queryFn: ({ pageParam }) => {
      const page = pageParam as number;

      return fetchProducts({
        ...filters,
        page,
        limit: 20,
      });
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.totalPages
        ? lastPage.meta.currentPage + 1
        : undefined,

    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

const JEWELRY_SET_SLUGS = ["pendant", "earring", "bracelet", "necklace"];

const useResolvedCategoryIds = (categorySlug: string) => {
  return useQuery<string[]>({
    queryKey: ["category-ids", categorySlug],

    queryFn: async () => {
      if (categorySlug === "jewelry-set") {
        const ids = await Promise.all(
          JEWELRY_SET_SLUGS.map((slug) => getCategoryIdBySlug(slug))
        );
        return ids.filter(Boolean) as string[];
      }

      const id = await getCategoryIdBySlug(categorySlug);
      return id ? [id] : [];
    },

    enabled: Boolean(categorySlug),
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
};

export const useProductsByCategory = (
  categorySlug: string,
  filters: Pick<ProductFilters, "minPrice" | "maxPrice"> = {}
) => {
  const { data: categoryIds, isLoading } = useResolvedCategoryIds(categorySlug);

  return useInfiniteQuery<ProductListResponse, Error>({
    queryKey: ["products", "category", categorySlug, filters],

    queryFn: ({ pageParam }) => {
      const page = pageParam as number;

      return fetchProducts({
        categoryId: categoryIds!,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        page,
        limit: 20,
      });
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.totalPages
        ? lastPage.meta.currentPage + 1
        : undefined,

    enabled: Boolean(categoryIds?.length) && !isLoading,

    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
