
export class ErrorResponse implements Express.Response
{
    public success: boolean;
    public error: InnerError;

    public constructor(message: string)
    {
        this.success = false;
        this.error = new InnerError(message);
    }
}

class InnerError 
{
    public message: string;

    public constructor(message: string)
    {
        this.message = message;
    }
}