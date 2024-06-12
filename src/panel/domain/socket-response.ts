export interface GenerationResponse{
    jobID: string
    status:"Generating"|"Generated"|"Failed"|"NotFound"
    output?:GenerationOutput|null
}


export interface GenerationOutput{
    outputPath?:string
    prompt:string
    duration:string
}