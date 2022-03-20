import express from 'express';
import { CommonRoutesConfig } from './common.routes.config';
import { RewardsController } from '../controllers/RewardsController';
import { ErrorResponse } from '../responses/ErrorResponse';
import { SuccessResponse } from '../responses/SuccessResponse';

export class RewardsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'RewardsRoutes');
    }

    configureRoutes() {
        this.app.route(`/users/:id/rewards`)
            .get((req: express.Request, res: express.Response) => {

                try 
                {
                    let userID = Number.parseInt(req.params.id);
                    let dateAtString = req.query.at;

                    if (dateAtString == undefined)
                        return res.send(new ErrorResponse("The date is not specified or valid"));
                        
                    let dateAt = new Date(String(req.query.at));
                    
                    return RewardsController.get_fetchRewards(userID, dateAt)
                    .then(result => res.send(result));
                    // .then(result => {
                    //     return res.send(new SuccessResponse(result));   
                    // });
                }
                catch (error)
                {
                    return res.send(new ErrorResponse(error.message));
                }
            })

        this.app.route(`/users/:id/rewards/:availableAt/redeem`)
            .patch((req: express.Request, res: express.Response) => {

                try
                {
                    let userID = Number.parseInt(req.params.id);
                    let availableAtString = req.params.availableAt;
                    let availableAt = new Date(availableAtString);

                    return RewardsController.patch_redeemReward(userID, availableAt)
                    .then(result => res.send(result));
                    // .then(result => {
                    //     return res.send(new SuccessResponse(result));
                    // });
                }
                catch (error)
                {
                    return res.send(new ErrorResponse(error.message));
                }
            })
    
        return this.app;
    }
}