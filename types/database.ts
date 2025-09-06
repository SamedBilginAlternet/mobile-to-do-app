export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          user_id?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          completed: boolean;
          project_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          completed?: boolean;
          project_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          completed?: boolean;
          project_id?: string;
          created_at?: string;
        };
      };
    };
  };
}