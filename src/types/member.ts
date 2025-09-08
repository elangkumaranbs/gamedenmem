export interface Member {
  id: string;
  created_at: string;
  full_name: string;
  card_number: string;
  phone: string;
  email: string;
  validity_start: string;
  validity_end: string;
}

export interface PlayHistory {
  id: string;
  created_at: string;
  member_id: string;
  play_date: string;
  is_free_play: boolean;
}

export interface MemberWithPlayCount extends Member {
  play_count: number;
  last_played?: string;
}