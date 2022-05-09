import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AccessToken, GoogleData } from './dto/oauth.dto';

@Injectable()
export class OauthService {
  async googleAccess({ accessToken }: AccessToken) {
    // try {
    // const { data } = await axios.get(
    //   `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
    // );
    try {
      const { data }: { data: GoogleData } = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
      );
    } catch (error) {
      console.log(error.response.data.error.message);
    }

    //   } catch (error) {
    //     console.log('hello');
    //     console.log(error);
    //   }
    //   console.log('hello');
  }
}
