import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Align, TableColumn } from 'simplemattable';
import { Doc } from './doc.model';
import { DocsService } from './docs.service'

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  number: string;
  state: string;
  title: string;
  created_at: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private http: HttpClient) { }

  getRepoIssues(sort: string, order: string, page: number, per_page: number): Observable<GithubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}&per_page=${per_page}`;
    return this.http.get<GithubApi>(requestUrl);
  }
}

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'number', 'title', 'created'];
  exampleDatabase: ExampleHttpDatabase | null;
  dataSource: MatTableDataSource<GithubIssue>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchbox') searchbox: ElementRef;
  selection = new SelectionModel<GithubIssue>(true, []);
  hovered = false
  states = [
    // { name: 'inbox', icon: 'inbox' },
    // { name: 'completed', icon: 'assignment_turned_in' },
    // { name: 'all docs', icon: 'all_inbox' },
    { name: 'open', icon: 'pending_actions' },
    { name: 'closed', icon: 'assignment_turned_in' },
    { name: 'all issues', icon: 'all_inbox' },
  ]
  actions = [
    { name: 'archive', icon: 'archive' },
    { name: 'delete', icon: 'delete' },
    { name: 'mark as unread', icon: 'markunread' },
    { name: 'snooze', icon: 'watch_later' },
  ]

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    this.fetchGithubIssues()
    this.addHoveredProperty()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: GithubIssue): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.number}`;
  }

  addHoveredProperty() {
    this.dataSource?.data.map((data: any) => {
      data.hovered = false
    });
  }

  handleMouseOver(row) {
    const number = row.number;
    this.dataSource.data.map((data: any) => {
      if (data.number === number) {
        data.hovered = true;
      }
    });
  }

  handleMouseLeave(row) {
    const number = row.number;
    this.dataSource.data.map((data: any) => {
      if (data.number === number) {
        data.hovered = false;
      }
    });
  }

  clearSearch() {
    this.dataSource.filter = ''
    this.searchbox.nativeElement.value = ''
  }

  fetchGithubIssues() {
    this.exampleDatabase = new ExampleHttpDatabase(this.http);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getRepoIssues(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource = new MatTableDataSource<GithubIssue>(data));
  }

  // ***********************************************************************************

  // data: any[]
  // columns: any[]
  // paginatorLength = 101
  // loading: boolean
  // labelList: any;

  // ngOnInit() {
  //   this.dataSource = []
  //   this.columns = [
  //     new TableColumn<Doc, 'id'>('Id', 'id'),
  //     new TableColumn<Doc, 'type'>('Title', 'type'),
  //     new TableColumn<Doc, 'source'>('Title', 'source'),
  //     new TableColumn<Doc, 'title'>('Title', 'title'),
  //     // new TableColumn<Doc, 'abstract'>('Title', 'abstract'),
  //     new TableColumn<Doc, 'assigned_at'>('Assigned at', 'assigned_at').withAlign(Align.RIGHT),
  //   ];
  // }

  // // ngAfterViewInit() {
  // //   this.manipulateDOM()
  // // }

  // getPaginatedData(offset: number, limit: number): Observable<Doc[]> {
  //   const total = 101
  //   /*
  //     Note that normally you would just return an observable obtained from a service method, e.g.:
  //     return this.myService.get(offset, limit);
  //   */
  //   console.log('Fetching page index ' + offset + ' with page size ' + limit);
  //   const observable = new Subject<Doc[]>();
  //   setTimeout(() => {
  //     // simulate backend request
  //     const data: Doc[] = [];
  //     // Generate entries up to the max count to simulate backend having no more data
  //     const limitThisPage = Math.min(limit, total - (offset * limit));
  //     for (let i = 0; i < limitThisPage; i++) {
  //       const item: Doc = {
  //         id: `id${i + 1 + (offset * limit)}`,
  //         type: 'type1',
  //         source: 'source1',
  //         title: `Title ${i + 1 + (offset * limit)}`,
  //         abstract: `Abstract ${i + 1 + (offset * limit)}`,
  //         assigned_at: new Date().toLocaleDateString(),
  //       }
  //       data.push(item);
  //     }
  //     observable.next(data);
  //   }, 1000);
  //   return observable;
  // }

  // /**
  //  * Direct DOM manipulations because simplemattable hasn't any way to setup some elements of mat-paginator, such as:
  //  * - paginator position: before (above) or after (below) mat-table rows
  //  * - hide navigation fisrt/last buttons
  //  *
  //  */
  // manipulateDOM() {
  //   // move the mat-paginator before mat-table
  //   const simplemattable = document.getElementsByTagName('smc-simplemattable')[0]
  //   const paginator = document.getElementsByTagName('mat-paginator')[0]
  //   simplemattable.insertAdjacentElement('afterbegin', paginator)

  //   // move a mat-divider below paginator
  //   const divider = document.getElementsByTagName('mat-divider')[0]
  //   paginator.insertAdjacentElement('afterend', divider)

  //   // remove paginator size selector
  //   const paginatorPageSize = document.getElementsByClassName('mat-paginator-page-size')[0]
  //   paginatorPageSize.remove()

  //   // remove navigation to first and last buttons
  //   const paginatorNavigationFirst = document.getElementsByClassName('mat-paginator-navigation-first')[0]
  //   const paginatorNavigationLast = document.getElementsByClassName('mat-paginator-navigation-last')[0]
  //   paginatorNavigationFirst.remove()
  //   paginatorNavigationLast.remove()
  // }

  // refresh(event?: PageEvent) {
  //   // this.loading = true
  //   this.getPaginatedData(event?.pageIndex, event?.pageSize).subscribe(
  //     next => this.dataSource = next,
  //     error => console.error(error),
  //     () => this.loading = false
  //   )
  // }

  // changeLabel(label: string) {
  //   console.log(label);
  //   const activeLabel = this.labelsList.selectedOptions.selected[0]?.value
  // }

  // viewDoc(doc: Doc) {
  //   console.log(doc);

  //   // GET http://api/docs/:id
  //   // router go to /d/:id
  // }

  // ***********************************************************************************





}

