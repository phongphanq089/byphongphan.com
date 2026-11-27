export type ProfileAvailabilityStatus =
  "available" | "building" | "busy" | "offline"

export interface ProfileTechGroup {
  id: string
  label: string
  items: string
}

export interface ProfileSocials {
  github: string
  linkedin: string
  twitter: string
  website: string
}

export interface AdminProfileData {
  fullName: string
  displayName: string
  headline: string
  bio: string
  extendedBio: string
  location: string
  timezone: string
  email: string
  phone: string
  avatarUrl: string
  githubUsername: string
  status: ProfileAvailabilityStatus
  statusLabel: string
  showLiveClock: boolean
  publicProfileVisible: boolean
  twoFactorEnabled: boolean
  emailNotifications: boolean
  socials: ProfileSocials
  techGroups: ProfileTechGroup[]
  updatedAt: string
}
