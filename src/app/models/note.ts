export interface INote {
    id: number;
    title: string;
    description: string;
    date: Date;
    color: string;
    tags: string[];
    group: { title: string, icon: string };
}