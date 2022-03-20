import { Reward } from "../models/Reward";

export class RewardsStore
{
    private static instance: RewardsStore;

    //This map represents a simplification of a Reward items in a DB that is linked by a User ID foreign key
    private rewardsMap: Map<number, Map<string, Reward>>;

    private constructor()
    {
        this.rewardsMap = new Map<number, Map<string, Reward>>();
    }

    //I am aware that dependency injection is used in this case when various DB stores or shared classes are registered. 
    //For simplicity's sake, I'm using a Singleton class.
    public static getInstance(): RewardsStore
    {
        if (!RewardsStore.instance)
        {
            RewardsStore.instance = new RewardsStore();
        }

        return RewardsStore.instance;
    }

    public getUserWeeklyRewardsForDate(userID: number, dateAt: Date): Reward[]
    {
        this.configureDateAndRewards(userID, dateAt);

        var startDateOfTargetWeek = this.getMondayOfWeekForDate(dateAt);
        var startDateOfNextWeek = new Date(startDateOfTargetWeek);
        startDateOfNextWeek.setDate(startDateOfTargetWeek.getDate() + 7);

        var rewardsForUser = this.rewardsMap.get(userID);
        var rewardsForWeek = Array.from(rewardsForUser.values())
                                .filter(item => item.availableAt >= startDateOfTargetWeek && item.availableAt < startDateOfNextWeek);
        return rewardsForWeek;
    }

    public redeemReward(userID: number, dateAt: Date): Reward
    {
        this.configureDateAndRewards(userID, dateAt);

        var rewardsForUser = this.rewardsMap.get(userID);
        var reward = rewardsForUser.get(dateAt.toISOString())

        var now = new Date();

        if (now < reward.availableAt)
            throw new Error("Cannot redeem a reward before it is available");
        if (now > reward.expiresAt)
            throw new Error("This reward is already expired");
        if (reward.redeemedAt !== null)
            throw new Error("This reward is already expired");

        reward.redeemedAt = now;

        return reward;
    }

    private configureDateAndRewards(userID: number, dateAt: Date)
    {
        dateAt.setHours(0,0,0,0);

        //This is a hacky approach to validating whether to insert a week's worth of rewards
        if (!this.rewardsMap.has(userID) || !this.rewardsMap.get(userID).has(dateAt.toISOString()))
            this.initialiseUserRewards(userID, dateAt);
    }

    private initialiseUserRewards(userID: number, dateAt: Date)
    {
        if (!this.rewardsMap.has(userID))
            this.rewardsMap.set(userID, new Map<string, Reward>());

        var userRewardsMap = this.rewardsMap.get(userID);

        var firstDateOfTheWeek = this.getMondayOfWeekForDate(dateAt);

        for (let i = 0; i < 7; i++)
        {
            var newDate = new Date(firstDateOfTheWeek);
            newDate.setDate(firstDateOfTheWeek.getDate() + i);
            let reward = new Reward(userID, newDate);
            userRewardsMap.set(newDate.toISOString(), reward);
        }
    }

    private getMondayOfWeekForDate(date: Date) {
        var newDate = new Date(date);
        newDate.setHours(0,0,0,0);
        var dayOfWeek = date.getDay(); //This returns a day offset for the day of the week.
        var difference = date.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1); //When the day is a Sunday, go back 6 days, otherwise add a single day to get to Monday.
        return new Date(newDate.setDate(difference));
      }
    }