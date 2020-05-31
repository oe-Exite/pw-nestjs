import { createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator((data, req) => {
    console.log('createParamDecorator', req);
    return req.user;
});