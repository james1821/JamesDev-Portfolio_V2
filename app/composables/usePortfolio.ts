import type { PortfolioContent } from '#shared/types'

/**
 * Single shared fetch of the portfolio record. Nuxt dedupes by key, so every
 * page and component reuses one payload instead of refetching.
 */
export function usePortfolio() {
  return useFetch<PortfolioContent>('/api/content', {
    key: 'portfolio-content',
    default: () => null,
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  })
}

export function useFeaturedProjects(content: Ref<PortfolioContent | null>) {
  return computed(() => content.value?.projects.filter((p) => p.featured) ?? [])
}

export function useActiveWork(content: Ref<PortfolioContent | null>) {
  return computed(() => (content.value?.currentWork ?? []).filter((w) => w.active).slice(0, 2))
}
