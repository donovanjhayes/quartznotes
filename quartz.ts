import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

const pinnedOrder = ["classroom", "bridges"]

ExternalPlugin.Explorer({
  sortFn: (a, b) => {
    const aIsFolder = a.isFolder ?? false
    const bIsFolder = b.isFolder ?? false
    if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1

    const aName = (a.displayName ?? "").toLowerCase()
    const bName = (b.displayName ?? "").toLowerCase()

    const ai = pinnedOrder.indexOf(aName)
    const bi = pinnedOrder.indexOf(bName)

    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1

    return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: "base" })
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()