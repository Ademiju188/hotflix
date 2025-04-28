interface Movies extends PageProps {
    id: number,
    uuid: string,
    title: string
    description: string;
    content_type: string;
    featured: boolean;
    premium: boolean;
    duration: number | string;
    banner_path: string;
    active: boolean | string,
    created_at: string,
    meta: {
        links: object
    },
    episodes: [],
    episodes_count: number
    // video: File | null;
    // categories: number[];
};
