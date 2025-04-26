

interface Movies {
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
    episodes: Episode[],
    episodes_count: number
    categories: Category[];
};

type Episode = {
    id: string | number;
    video: File | null;
    is_premium: boolean;
    existing_video?: string;
    video_path?: string,
    active: boolean
};

type Category = {
    id: number,
    name: string
}

type MovieProps = {
    movies: Movies[],
}

const MovieShow = ({ movies }: MovieProps) => {

};

export default MovieShow;
