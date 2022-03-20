import { RewardsController } from "../src/controllers/RewardsController";
import { Reward } from "../src/models/Reward";
import { ErrorResponse } from "../src/responses/ErrorResponse";
import { SuccessResponse } from "../src/responses/SuccessResponse";

//I am not familiar with the conventions Jest-TS uses to assert behaviours
//I am familiar with NUnit in C#, and tried to follow the same approach, given the time and scope of the project. 
//Also, in reality, there should be finer grain tests for these controller methods, or at least in the tests for the Store objects
describe('RewardsController', () => {
  it("GET Fetch Rewards", async (done) => {
  
    let testUserID = 1;
    let dateAt = new Date("2021/05/18"); //A tuesday

    let response: SuccessResponse<Reward[]> = await RewardsController.get_fetchRewards(testUserID, dateAt);
    expect(response.data).toHaveLength(7);

      //We should test these thoroughly, but because we are mocking this service, I am just testing the first and last items of the week.
    expect(response.data[0].availableAt).toEqual(new Date("2021/05/17"));
    expect(response.data[0].redeemedAt).toBeNull();
    expect(response.data[0].expiresAt).toEqual(new Date("2021/05/18"));

    expect(response.data[6].availableAt).toEqual(new Date("2021/05/23"));
    expect(response.data[6].redeemedAt).toBeNull();
    expect(response.data[6].expiresAt).toEqual(new Date("2021/05/24"));

    done();
  });

  it("PATCH Redeem Reward", async (done) => {

    let testUserID = 1;
    let dateAt = new Date("2021/05/18");

    //Check that past items can't be redeemed as they're already expired
    let itemExpiredResponse: ErrorResponse = await RewardsController.patch_redeemReward(testUserID, dateAt);
    expect(itemExpiredResponse.success).toEqual(false);
    expect(itemExpiredResponse.error.message).toEqual("This reward is already expired");

    let dateNow = new Date();
    let dateToday = new Date();
    dateToday.setHours(0,0,0,0);
    let dateTomorrow = new Date(dateToday);
    dateTomorrow.setDate(dateToday.getDate() + 1);

    let itemSuccessfullyRedeemedResponse: SuccessResponse<Reward> = await RewardsController.patch_redeemReward(testUserID, dateNow);
    expect(itemSuccessfullyRedeemedResponse.success).toEqual(true);
    expect(itemSuccessfullyRedeemedResponse.data.availableAt).toEqual(dateToday);
    expect(itemSuccessfullyRedeemedResponse.data.redeemedAt.getDate()).toBeCloseTo(dateNow.getDate());
    expect(itemSuccessfullyRedeemedResponse.data.expiresAt).toEqual(dateTomorrow);

    //Check that item can't be deemed twice
    let itemAlreadyRedeemedResponse: ErrorResponse = await RewardsController.patch_redeemReward(testUserID, dateNow);
    expect(itemAlreadyRedeemedResponse.success).toEqual(false);
    expect(itemAlreadyRedeemedResponse.error.message).toEqual("This reward is already expired");

    done();
  });
});
