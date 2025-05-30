export interface EventEntity {
  id: number
  title: string
  description?: string
  dates: string[]
  start_time: string
  end_time: string
}

export interface WorkScheduleEntity {
  id: number
  day: string
  open_time: string
  close_time: string
}
