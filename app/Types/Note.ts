export type TNote={
    id:string;
    userid:string
    title:string;
    body?:string;
    created_at:Date;
    updated_at?:Date;
    stared:boolean;
}
