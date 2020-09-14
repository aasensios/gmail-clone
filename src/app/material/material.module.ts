import { NgModule } from '@angular/core'

// Import the NgModule for each component you want to use:
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'

// import { MatAutocompleteModule } from '@angular/material/autocomplete'
// import { MatCardModule } from '@angular/material/card'
// import { MatDialogModule } from '@angular/material/dialog'
// import { MatFormFieldModule } from '@angular/material/form-field'
// import { MatMenuModule } from '@angular/material/menu'
// import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar'
// import { MatTabsModule } from '@angular/material/tabs'
// import { MaterialFileInputModule } from 'ngx-material-file-input'

const material = [
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
]

@NgModule({
  declarations: [
  ],
  imports: material,
  exports: material,
  providers: [
    // { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
  ],
  bootstrap: []
})
export class MaterialModule { }
