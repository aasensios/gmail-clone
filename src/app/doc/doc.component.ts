import { Component, Input, OnInit } from '@angular/core';
import { GithubIssue } from '../docs/github-issue.model';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocComponent implements OnInit {

  @Input() issue: GithubIssue

  constructor() {  }

  ngOnInit(): void {
  }

}
