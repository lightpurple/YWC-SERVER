import ApiError from "../../../common/api.error";
import ApiCodes from "../../../common/api.codes";
import ApiMessages from "../../../common/api.messages";
import { assertNotNull, assertTrue } from "../../../../src/lib/utils";
import { CookieOptions } from "express";
import env from "../../../env";

export default class AuthService {
    public adminSignIn = async (password) => {
        assertNotNull(
            password,
            new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                message: "password are required",
            })
        );

        const isAdminPasswordValid = await this.checkAdminPassword(password);

        assertTrue(
            isAdminPasswordValid,
            new ApiError(ApiCodes.UNAUTHORIZED, ApiMessages.UNAUTHORIZED, {
                message: "Invalid password",
            })
        );

        return this.generateToken();
    };

    public createCookieOptions = (): CookieOptions => {
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            maxAge: 1000 * 60 * 30,
            domain: process.env.COOKIE_DOMAIN,
        };
        return cookieOptions;
    };

    public expireCookieOptions = (): CookieOptions => {
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            maxAge: 0,
            expires: new Date(0),
            domain: process.env.COOKIE_DOMAIN,
        };
        return cookieOptions;
    };

    private generateToken = async () => {
        const token = {
            role: "admin",
        };
        return token;
    };

    private checkAdminPassword = async (password: string): Promise<boolean> => {
        if (env.admin.password === password) {
            return true;
        }
        return false;
    };
}
