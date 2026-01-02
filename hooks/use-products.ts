import { useQuery } from "@tanstack/react-query"
import { fetchProducts, type ProductFilters, type ProductListResponse } from "@/services/product-service"

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery<ProductListResponse, Error>({
    queryKey: ["products", "list", filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes - prevents unnecessary refetches
    placeholderData: (previousData) => previousData, // Smooth transitions
    retry: 2, // Retry failed requests
  })
}
