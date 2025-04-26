declare namespace App {
    export interface Category {
      id: bigint;
      uuid: string;
      name: string;
      active: string;
      description: string;
      created_at: string;
      updated_at: string;
    }
  }

  interface CategoryIndexProps extends PageProps {
    categories: {
      data: App.Category[];
      links?: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
      };
      meta?: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
          url: string | null;
          label: string;
          active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
      };
    };
  }
