export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  html_url: string;
  number: string;
  state: string;
  title: string;
  created_at: string;
}
