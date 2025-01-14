export type TNote={
    id:string;
    title:string;
    body?:string;
    created_at:Date;
    updated_at?:Date;
    stared:boolean;
}