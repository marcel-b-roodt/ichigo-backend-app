import { User } from "../models/User";

export class UserStore
{
    private static instance: UserStore;

    //This map is emulating a User table in some kind of Database
    private userMap: Map<number, User>;

    private constructor()
    {
        this.userMap = new Map<number, User>();
    }

    //I am aware that dependency injection is used in this case when various DB stores or shared classes are registered. 
    //For simplicity's sake, I'm using a Singleton class.
    public static getInstance(): UserStore
    {
        if (!UserStore.instance)
        {
            UserStore.instance = new UserStore();
        }

        return UserStore.instance;
    }

    //For the toy app's purpose, if we try to access a user, we'll create one and assume it exists.
    public getUser(userID: number): User
    {
        if (!this.userMap.has(userID))
            this.createUser(userID);

        return this.userMap.get(userID);
    }

    private createUser(userID: number)
    {
        var user = new User(userID);
        this.userMap.set(userID, user);
    }
}