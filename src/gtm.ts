const GTM_VIEW_SOURCE_ON_GITHUB = 'view-source-on-github'
const GTM_VIEW_ALL_EXAMPLES = 'view-all-examples'
const GTM_OPEN_NEW_WINDOW = 'open-new-window'

declare global {
  interface Window {
    dataLayer: [any]
  }
}
window.dataLayer = window.dataLayer || []

const push = (data: {}) => {
  window.dataLayer.push(data)
}

export const viewRepoAtGithub = (projectName: string) => {
  push({ event: GTM_VIEW_SOURCE_ON_GITHUB, projectName })
}

export const viewAllExamples = (projectName: string) => {
  push({ event: GTM_VIEW_ALL_EXAMPLES, projectName })
}

export const openNewWindow = (projectName: string) => {
  push({ event: GTM_OPEN_NEW_WINDOW, projectName })
}
