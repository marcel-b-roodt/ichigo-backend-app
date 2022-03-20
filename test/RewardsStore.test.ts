import { RewardsStore } from '../src/data/RewardsStore';

describe('RewardsStore', () => {
  it("Fetch Rewards", () => {
  
    let testUserID = 1;
    let dateAt = new Date("2021/05/18"); //A tuesday

    let rewards = RewardsStore.getInstance().getUserWeeklyRewardsForDate(testUserID, dateAt);
    expect(rewards).toHaveLength(7);

    //We should test these thoroughly, but because we are mocking this service, I am just testing the first and last items of the week.
    expect(rewards[0].availableAt).toEqual(new Date("2021/05/17"));
    expect(rewards[0].redeemedAt).toBeNull();
    expect(rewards[0].expiresAt).toEqual(new Date("2021/05/18"));

    expect(rewards[6].availableAt).toEqual(new Date("2021/05/23"));
    expect(rewards[6].redeemedAt).toBeNull();
    expect(rewards[6].expiresAt).toEqual(new Date("2021/05/24"));
  });

  it("Redeem Rewards", () => {

    let testUserID = 1;
    let dateAt = new Date("2021/05/18"); //A tuesday

    //This checks that past items can't be redeemed as they're already expired
    expect(() => { 
      RewardsStore.getInstance().redeemReward(testUserID, dateAt) 
    })
    .toThrowError("This reward is already expired");

    let dateNow = new Date();
    let dateToday = new Date();
    dateToday.setHours(0,0,0,0);
    let dateTomorrow = new Date(dateToday);
    dateTomorrow.setDate(dateToday.getDate() + 1);

    let reward = RewardsStore.getInstance().redeemReward(testUserID, dateNow);
    expect(reward.availableAt).toEqual(dateToday);
    expect(reward.redeemedAt.getDate()).toBeCloseTo(dateNow.getDate());
    expect(reward.expiresAt).toEqual(dateTomorrow);

    expect(() => { 
      RewardsStore.getInstance().redeemReward(testUserID, dateNow) 
    }).toThrowError("This reward is already expired");


    

    //RewardsController.patch_redeemReward();
  });
});
