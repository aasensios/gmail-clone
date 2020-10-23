import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubApi } from './github-issue.model';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  constructor(private http: HttpClient) { }

  getRepoIssues(repo: string, sort: string, order: string, page: number, per_page: number): Observable<GithubApi> {
    return this.http.get<GithubApi>(`https://api.github.com/search/issues?q=repo:${repo}&sort=${sort}&order=${order}&page=${page + 1}&per_page=${per_page}`);
  }
}
