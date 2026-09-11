import type { ReactNode } from 'react'

export type Approver = 'Marc' | 'Frank'

export type FeedbackMode = 'feedback' | 'vibe'

export type FeedbackDeliveryStatus =
  | 'feedback_only'
  | 'queued'
  | 'thinking'
  | 'in_progress'
  | 'vibing'
  | 'deploying'
  | 'resolved'
  | 'revert_requested'
  | 'reverting'
  | 'reverted'
  | 'failed'

export type Prototype = {
  id: string
  title: string
  description: string
  createdAt: string
  status: string
  tags: string[]
  path: string
  previewImage: string
}

export type FeedbackImage = {
  id: string
  name: string
  path?: string
  src: string
}

export type DraftFeedbackImage = FeedbackImage & {
  file?: File
}

export type RuntimeContext = {
  prototype: Pick<Prototype, 'id' | 'title' | 'description' | 'status' | 'tags'> & {
    configuredPath: string
  }
  route: string
  url: string
  pageTitle: string
  viewport: {
    width: number
    height: number
  }
  userAgent: string
  submittedAt: string
}

export type FeedbackItem = {
  codexPrompt: string
  context: Partial<RuntimeContext>
  createdAt?: string
  deliveryResult?: Record<string, unknown>
  deliveryStatus: FeedbackDeliveryStatus
  done: boolean
  id: string
  images: FeedbackImage[]
  text: string
}

export type PrototypeApprovals = Partial<Record<Approver, boolean>>

export type PrototypeLibraryState = {
  approvals?: Record<string, PrototypeApprovals>
  feedbackItems?: Record<string, FeedbackItem[]>
}

export type LucideIconComponent = React.ComponentType<{
  'aria-hidden'?: boolean | 'true' | 'false'
  fill?: string
  size?: number
  strokeWidth?: number
}>

export type DetailValueContent = string | string[]

export type DetailRowData = {
  action?: ReactNode
  icon?: ReactNode
  label: string
  shaded?: boolean
  value: DetailValueContent
}
