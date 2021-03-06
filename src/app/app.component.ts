import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { merge, of as observableOf } from 'rxjs'
import { catchError, map, startWith, switchMap } from 'rxjs/operators'
import { GithubService } from './github.service'
import { GithubIssue } from './github.model'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  faGithub = faGithub
  @ViewChild('repobox') repobox: HTMLInputElement
  repo = 'angular/material'
  dataSource: MatTableDataSource<GithubIssue>
  displayedColumns: string[] = ['select', 'title', 'created']
  resultsLength = 0
  isLoadingResults = true
  isRateLimitReached = false
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  selection = new SelectionModel<GithubIssue>(true, [])
  states = [
    { name: 'All issues', icon: 'all_inbox' },
    { name: 'Open issues', icon: 'pending_actions' },
    { name: 'Closed issues', icon: 'assignment_turned_in' },
    { name: 'Starred issues', icon: 'star_outline' },
  ]
  actions = [
    { name: 'archive', icon: 'archive', method: this.actionToBeImplemented },
    { name: 'delete', icon: 'delete', method: this.actionToBeImplemented },
    { name: 'mark as unread', icon: 'markunread', method: this.actionToBeImplemented },
    { name: 'snooze', icon: 'watch_later', method: this.actionToBeImplemented },
  ]

  constructor(private service: GithubService) { }

  ngAfterViewInit() {
    this.fetchGithubIssues()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource?.data.length
    return numSelected === numRows
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row))
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: GithubIssue): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.number}`
  }

  clearInput(inputElement: HTMLInputElement) {
    this.dataSource.filter = ''
    inputElement.value = ''
  }

  fetchGithubIssues() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0)
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true
          return this.service.getIssues(this.repo, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize)
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false
          this.isRateLimitReached = false
          this.resultsLength = data.total_count
          return data.items
        }),
        catchError(() => {
          this.isLoadingResults = false
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true
          return observableOf([])
        })
      ).subscribe(data => this.dataSource = new MatTableDataSource<GithubIssue>(data))
  }

  openInNew(url) {
    window.open(url)
  }

  actionToBeImplemented(row, action) {
    console.log(`issue ${row.number} ${action.name} clicked!`)
  }

  goToThisGithubRepo() {
    window.open("https://github.com/aasensios/gmail-clone")
  }

}
