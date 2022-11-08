import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {AppConfigService} from "../core/services/app-config.service";

@Injectable()
export class UserService {

  private urlBase?: string;

  constructor(private httpClient: HttpClient, private config: AppConfigService) {
    this.urlBase = config.appSettings.apiRoot;
    if(!config.appSettings.withoutProxy)
      this.urlBase = this.urlBase + '/identity';
  }

  queryUsers(query: UserQueryRequest): Observable<UserQueryResponse> {
    return this.httpClient.post<UserQueryResponse>(`${this.urlBase}/UserManagement/queryusers`, query)
  }

  inviteNewUser(email: string): Observable<void> {
    return this.httpClient.post<void>(`${this.urlBase}/UserManagement/InviteNewUser`, null, {params: {email: email}})
  }

  resendInvitation(email: string): Observable<void> {
    return this.httpClient.post<void>(`${this.urlBase}/UserManagement/ResendInvitation`, null, {params: {email: email}})
  }

  lockoutUser(email: string, until: Date): Observable<void> {
    return this.httpClient.put<void>(`${this.urlBase}/UserManagement/LockoutUser`, null, {params: {email: email, until: until.toISOString()}})
  }

  unsuspendUser(email: string): Observable<void> {
    return this.httpClient.put<void>(`${this.urlBase}/UserManagement/LockoutUser`, null, {params: {email: email}})
  }
}

export interface UserQueryRequest {
  rows: number
  offset: number
  sortField?: string
  sortOrder?: number
}

export interface UserQueryResponse {
  result: User[]
  page: number
  totalPagesCount: number
  totalRecordsCount: number
  recordsPerPageCount: number
  isNext: boolean
  isPrev: boolean
}

export interface User {
  id?: string;
  email?: string;
  emailConfirmed?: boolean;
  lockoutEnd?: Date;
  isAdmin?: boolean;
}

