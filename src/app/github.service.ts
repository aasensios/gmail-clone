import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { GithubApi } from './github.model'

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private http: HttpClient) { }

  getIssues(repo: string, sort: string, order: string, page: number, per_page: number): Observable<GithubApi> {
    return this.http.get<GithubApi>(`https://api.github.com/search/issues?q=repo:${repo}&sort=${sort}&order=${order}&page=${page + 1}&per_page=${per_page}`)
  }
}
