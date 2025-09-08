export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          created_at: string
          full_name: string
          card_number: string
          phone: string
          email: string
          validity_start: string
          validity_end: string
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          card_number: string
          phone: string
          email: string
          validity_start?: string
          validity_end?: string
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          card_number?: string
          phone?: string
          email?: string
          validity_start?: string
          validity_end?: string
        }
      }
      play_history: {
        Row: {
          id: string
          created_at: string
          member_id: string
          play_date: string
          is_free_play: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          member_id: string
          play_date?: string
          is_free_play?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          member_id?: string
          play_date?: string
          is_free_play?: boolean
        }
      }
    }
  }
}