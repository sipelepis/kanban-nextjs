export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Boards: {
        Row: {
          BoardName: string | null
          CreationDate: string
          Description: string | null
          id: number
        }
        Insert: {
          BoardName?: string | null
          CreationDate?: string
          Description?: string | null
          id?: number
        }
        Update: {
          BoardName?: string | null
          CreationDate?: string
          Description?: string | null
          id?: number
        }
        Relationships: []
      }
      Cards: {
        Row: {
          ColumnID: number | null
          CreationDate: string
          Description: string | null
          DueDate: string | null
          id: number
          LastUpdated: string | null
          Priority: number | null
          Title: string | null
        }
        Insert: {
          ColumnID?: number | null
          CreationDate?: string
          Description?: string | null
          DueDate?: string | null
          id?: number
          LastUpdated?: string | null
          Priority?: number | null
          Title?: string | null
        }
        Update: {
          ColumnID?: number | null
          CreationDate?: string
          Description?: string | null
          DueDate?: string | null
          id?: number
          LastUpdated?: string | null
          Priority?: number | null
          Title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Cards_ColumnID_fkey"
            columns: ["ColumnID"]
            isOneToOne: false
            referencedRelation: "Columns"
            referencedColumns: ["id"]
          },
        ]
      }
      Columns: {
        Row: {
          BoardID: number | null
          ColumnName: string | null
          CreationDate: string
          id: number
          Position: number | null
        }
        Insert: {
          BoardID?: number | null
          ColumnName?: string | null
          CreationDate?: string
          id?: number
          Position?: number | null
        }
        Update: {
          BoardID?: number | null
          ColumnName?: string | null
          CreationDate?: string
          id?: number
          Position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Columns_BoardID_fkey"
            columns: ["BoardID"]
            isOneToOne: false
            referencedRelation: "Boards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
