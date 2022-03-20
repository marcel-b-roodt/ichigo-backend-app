
export class SuccessResponse<T = void> implements Express.Response
{
    public success: boolean;
    public data: T;

    public constructor(data: T)
    {
        this.success = true;
        this.data = data;
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