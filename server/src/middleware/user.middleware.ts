import { Request } from "express";
import { NextFunction, Response } from "express";



interface UserRequest extends Request {
    userID?: string
}

export const userMiddleware = (req: UserRequest, res: Response, next: NextFunction) => {
    const { userID } = req.body;
    if (!userID) {
        return 
    }
    req.userID = userID;
    next();
}
