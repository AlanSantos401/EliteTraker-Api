import { Request, Response } from "express";
import axios, { isAxiosError } from "axios";

const clientId = 'Ov23liSUncGKL3uG9NqF'
const clientSecret = 'b1b87ca43014ad867980e6e252630874a3d45f63'

export class AuthController {
    auth = async (request: Request, response: Response) => {
        const redirectURL = `https://github.com/login/oauth/authorize?client_id=${clientId}`

        response.redirect(redirectURL)
    }

    authCallback = async (request: Request, response: Response) => {
        try {

            const { code } = request.query

            const accessTokenResult = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: clientId,
                client_secret: clientSecret,
                code,

            }, {
                headers: {
                    Accept: 'application/json'
                }
            })

            const userDataResult = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessTokenResult.data.access_token}`
                }
            })

            const { node_id: id, avatar_url: avatarURL, name } = userDataResult.data


            return response.status(200).json({ id, avatarURL, name })
        } catch (err) {
            if (isAxiosError(err)) {
                return response.status(400).json(err.response?.data)
            }

            return response.status(500).json({ message: "Something went wrong."})
        }
    }
}
