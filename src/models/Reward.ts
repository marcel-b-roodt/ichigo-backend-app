export class Reward 
{
    public userID: number;
    public availableAt: Date;
    public redeemedAt: Date;
    public expiresAt: Date;

    public constructor(userID: number, availableDate: Date)
    {
        var expiryDate = new Date(availableDate);
        expiryDate.setDate(availableDate.getDate() + 1);
        
        this.userID = userID;
        this.availableAt = availableDate;
        this.redeemedAt = null;
        this.expiresAt = expiryDate;
    }
}