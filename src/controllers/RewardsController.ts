import { RewardsStore } from "../data/RewardsStore";
import { Reward } from "../models/Reward";
import { ErrorResponse } from "../responses/ErrorResponse";
import { SuccessResponse } from "../responses/SuccessResponse";

//This class would be used to compose complex DTO-type objects to return to the front-end via the route config
//Ideally the routes should really not do much other than calling a controller method
export class RewardsController
{
    public static async get_fetchRewards(userID: number, dateAt: Date): Promise<any>
    {
        try 
        {
            let result = await RewardsStore.getInstance().getUserWeeklyRewardsForDate(userID, dateAt);
            return new SuccessResponse<Reward[]>(result);
        }
        catch (error)
        {
            return new ErrorResponse(error.message);
        }
    }

    public static async patch_redeemReward(userID: number, dateAt: Date): Promise<any>
    {
        try 
        {
            let result = await RewardsStore.getInstance().redeemReward(userID, dateAt);
            return new SuccessResponse<Reward>(result);
        }
        catch (error)
        {
            return new ErrorResponse(error.message);
        }
    }
}