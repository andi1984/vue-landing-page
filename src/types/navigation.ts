export interface NavigationLink {
  label: string
  url: string
}

export interface NavigationSection {
  links: NavigationLink[]
}

export interface NavigationData {
  [sectionName: string]: NavigationSection
}
