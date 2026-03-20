export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  rift_master: {
    Tables: {
      card: {
        Row: {
          collector_number: number | null
          created_at: string
          energy: number | null
          id: number
          media_ref_id: number | null
          metadata_ref_id: number | null
          might: number | null
          name: string
          orientation: string | null
          plain_text: string | null
          power: number | null
          public_code: string | null
          rarity_ref_id: number | null
          rich_text: string | null
          riftbound_id: string
          set_ref_id: number | null
          supertype_ref_id: number | null
          tcgplayer_id: string | null
          type_ref_id: number | null
        }
        Insert: {
          collector_number?: number | null
          created_at?: string
          energy?: number | null
          id?: number
          media_ref_id?: number | null
          metadata_ref_id?: number | null
          might?: number | null
          name: string
          orientation?: string | null
          plain_text?: string | null
          power?: number | null
          public_code?: string | null
          rarity_ref_id?: number | null
          rich_text?: string | null
          riftbound_id: string
          set_ref_id?: number | null
          supertype_ref_id?: number | null
          tcgplayer_id?: string | null
          type_ref_id?: number | null
        }
        Update: {
          collector_number?: number | null
          created_at?: string
          energy?: number | null
          id?: number
          media_ref_id?: number | null
          metadata_ref_id?: number | null
          might?: number | null
          name?: string
          orientation?: string | null
          plain_text?: string | null
          power?: number | null
          public_code?: string | null
          rarity_ref_id?: number | null
          rich_text?: string | null
          riftbound_id?: string
          set_ref_id?: number | null
          supertype_ref_id?: number | null
          tcgplayer_id?: string | null
          type_ref_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "card_media_ref_id_fkey"
            columns: ["media_ref_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_metadata_ref_id_fkey"
            columns: ["metadata_ref_id"]
            isOneToOne: false
            referencedRelation: "metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_rarity_ref_id_fkey"
            columns: ["rarity_ref_id"]
            isOneToOne: false
            referencedRelation: "rarity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_set_ref_id_fkey"
            columns: ["set_ref_id"]
            isOneToOne: false
            referencedRelation: "set"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_supertype_ref_id_fkey"
            columns: ["supertype_ref_id"]
            isOneToOne: false
            referencedRelation: "supertype"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_type_ref_id_fkey"
            columns: ["type_ref_id"]
            isOneToOne: false
            referencedRelation: "type"
            referencedColumns: ["id"]
          },
        ]
      }
      card_domain: {
        Row: {
          card_ref_id: number
          created_at: string
          domain_ref_id: number
          id: number
        }
        Insert: {
          card_ref_id: number
          created_at?: string
          domain_ref_id: number
          id?: number
        }
        Update: {
          card_ref_id?: number
          created_at?: string
          domain_ref_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_domain_card_ref_id_fkey"
            columns: ["card_ref_id"]
            isOneToOne: false
            referencedRelation: "card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_domain_domain_ref_id_fkey"
            columns: ["domain_ref_id"]
            isOneToOne: false
            referencedRelation: "domain"
            referencedColumns: ["id"]
          },
        ]
      }
      card_price: {
        Row: {
          avg_price_cents: number
          blueprint_id: number | null
          card_id: number | null
          card_market_id: number | null
          country_code: string
          created_at: string
          id: number
          min_price_cents: number
        }
        Insert: {
          avg_price_cents?: number
          blueprint_id?: number | null
          card_id?: number | null
          card_market_id?: number | null
          country_code?: string
          created_at?: string
          id?: number
          min_price_cents?: number
        }
        Update: {
          avg_price_cents?: number
          blueprint_id?: number | null
          card_id?: number | null
          card_market_id?: number | null
          country_code?: string
          created_at?: string
          id?: number
          min_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_price_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "card"
            referencedColumns: ["id"]
          },
        ]
      }
      card_tag: {
        Row: {
          card_ref_id: number
          created_at: string
          id: number
          tag_ref_id: number
        }
        Insert: {
          card_ref_id: number
          created_at?: string
          id?: number
          tag_ref_id: number
        }
        Update: {
          card_ref_id?: number
          created_at?: string
          id?: number
          tag_ref_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_tag_card_ref_id_fkey"
            columns: ["card_ref_id"]
            isOneToOne: false
            referencedRelation: "card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_tag_tag_ref_id_fkey"
            columns: ["tag_ref_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      domain: {
        Row: {
          code: string
          created_at: string
          id: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      keyword: {
        Row: {
          code: string
          created_at: string
          id: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      media: {
        Row: {
          accessibility_text: string | null
          artist: string | null
          created_at: string
          id: number
          image_url: string | null
        }
        Insert: {
          accessibility_text?: string | null
          artist?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
        }
        Update: {
          accessibility_text?: string | null
          artist?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
        }
        Relationships: []
      }
      metadata: {
        Row: {
          alternate_art: boolean | null
          clean_name: string | null
          created_at: string
          id: number
          overnumbered: boolean | null
          signature: boolean | null
        }
        Insert: {
          alternate_art?: boolean | null
          clean_name?: string | null
          created_at?: string
          id?: number
          overnumbered?: boolean | null
          signature?: boolean | null
        }
        Update: {
          alternate_art?: boolean | null
          clean_name?: string | null
          created_at?: string
          id?: number
          overnumbered?: boolean | null
          signature?: boolean | null
        }
        Relationships: []
      }
      rarity: {
        Row: {
          code: string
          created_at: string
          id: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      set: {
        Row: {
          card_count: number | null
          cardmarket_id: string | null
          created_at: string
          id: number
          label: string | null
          name: string
          publish_date: string | null
          riftbound_id: string
          tcgplayer_id: string
          update_date: string | null
        }
        Insert: {
          card_count?: number | null
          cardmarket_id?: string | null
          created_at?: string
          id?: number
          label?: string | null
          name: string
          publish_date?: string | null
          riftbound_id: string
          tcgplayer_id: string
          update_date?: string | null
        }
        Update: {
          card_count?: number | null
          cardmarket_id?: string | null
          created_at?: string
          id?: number
          label?: string | null
          name?: string
          publish_date?: string | null
          riftbound_id?: string
          tcgplayer_id?: string
          update_date?: string | null
        }
        Relationships: []
      }
      supertype: {
        Row: {
          code: string
          created_at: string
          id: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      tag: {
        Row: {
          code: string
          created_at: string
          id: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      type: {
        Row: {
          code: string
          created_at: string
          id: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      import_riftbound_cards: { Args: never; Returns: undefined }
      import_riftbound_domains: { Args: never; Returns: undefined }
      import_riftbound_keywords: { Args: never; Returns: undefined }
      import_riftbound_rarities: { Args: never; Returns: undefined }
      import_riftbound_sets: { Args: never; Returns: undefined }
      import_riftbound_supertypes: { Args: never; Returns: undefined }
      import_riftbound_tags: { Args: never; Returns: undefined }
      import_riftbound_types: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  rift_master: {
    Enums: {},
  },
} as const
