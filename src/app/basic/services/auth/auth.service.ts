import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080';

export const AUTH_HEADER = 'Authorization';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService
  ) {}

  registerClient(signupRequestDto: any): Observable<any> {
    return this.http.post(BASIC_URL + '/client/signup', signupRequestDto);
  }

  registerCompany(signupRequestDto: any): Observable<any> {
    return this.http.post(BASIC_URL + '/company/signup', signupRequestDto);
  }

  login(username: string, password: string) {
    return this.http
      .post(
        BASIC_URL + '/authenticate',
        { username, password },
        { observe: 'response' } // Ensure you are observing the full response to get headers
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          console.log(res.body);

          this.userStorageService.saveUser(res.body);

          // Ensure we are checking the correct header
          const authHeader = res.headers.get(AUTH_HEADER);
          if (authHeader) {
            // Extract Bearer token, safely handling potential null values
            const bearerToken = authHeader.startsWith('Bearer ')
              ? authHeader.substring(7)
              : null;

            console.log('Token:', bearerToken);
            this.userStorageService.saveToken(bearerToken);
            return res;
          } else {
            console.error('Authorization header not found in the response');
            return null;
          }
        })
      );
  }

  /* login(username: string, password: string) {
    return this.http
      .post(
        BASIC_URL + '/authenticate',
        { username, password },
        { observe: 'response' }
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          console.log(res.body);
          const tokenLength = res.headers.get(AUTH_HEADER)?.length;
          const bearerToken = res.headers
            .get(AUTH_HEADER)
            ?.substring(7, tokenLength);
          console.log(bearerToken);
          return res;
        })
      );
  } */
}
