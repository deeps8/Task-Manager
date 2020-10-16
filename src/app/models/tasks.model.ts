export interface taskDetails{
    tid:string,
    uid:string,
    dateCreated:string,
    done:boolean,
    title:string,
    description:string,
    dueDate:string,
    time:string,
    reminder:string,
    priority:number,
    checklist:[
        {
            value:string,
            checked:string
        }
    ]
}