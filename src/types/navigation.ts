export interface NavigationLink {
  label: string
  url: string
  icon?: string
  description?: string
  color?: string
}

export interface NavigationSection {
  links: NavigationLink[]
}

export interface NavigationData {
  [sectionName: string]: NavigationSection
}
