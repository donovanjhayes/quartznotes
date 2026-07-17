import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Helper: is this page inside content/bridges/... ?
const isBridgesPage = (page: any) => page.fileData.slug?.startsWith("bridges/") ?? false

// components shared across all pages (header/footer)
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/YOUR_USERNAME/YOUR_REPO", // <- your repo
    },
  }),
}

// components for single-page views (a note, a bridges entry, etc.)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      folderDefaultState: "open", // keep classroom folders expanded by default
      folderClickBehavior: "link", // clicking a folder name opens its index page
      sortFn: (a, b) => {
        // pin classroom above bridges, alphabetical within each
        const order = ["classroom", "bridges"]
        const ai = order.indexOf(a.name ?? "")
        const bi = order.indexOf(b.name ?? "")
        if (ai !== -1 || bi !== -1) {
          if (ai === -1) return 1
          if (bi === -1) return -1
          return ai - bi
        }
        return (a.displayName ?? "").localeCompare(b.displayName ?? "")
      },
      filterFn: (node) => node.name !== "templates",
    }),
  ],
  // right sidebar swaps depending on section:
  // classroom pages -> graph + backlinks (encourages exploring connected notes)
  // bridges pages   -> just a "recent bridges" list, lighter weight
  right: [
    Component.ConditionalRender({
      component: Component.Graph({ localGraph: { showTags: true } }),
      condition: (page) => !isBridgesPage(page),
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: (page) => !isBridgesPage(page),
    }),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "Recent bridges",
        limit: 5,
        filter: (f) => f.slug?.startsWith("bridges/") ?? false,
      }),
      condition: (page) => isBridgesPage(page),
    }),
  ],
}

// components for list pages (folder index pages, tag pages)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      folderDefaultState: "collapsed", // collapse personal notes
      sortFn: (a, b) => {
        const order = ["classroom", "bridges"]
        const ai = order.indexOf(a.name ?? "")
        const bi = order.indexOf(b.name ?? "")
        if (ai !== -1 || bi !== -1) {
          if (ai === -1) return 1
          if (bi === -1) return -1
          return ai - bi
        }
        return (a.displayName ?? "").localeCompare(b.displayName ?? "")
      },
    }),
  ],
  right: [],
}
