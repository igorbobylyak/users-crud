import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SimpleTableConfig {
  headers: string[];
  data: any[];
  excludeFields?: string[];
}

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent {
  @Input() config: SimpleTableConfig;
  
  @Output() rowClickedEvent: EventEmitter<any> = new EventEmitter<any>();

  handleRowClicked(row: any) {
    this.rowClickedEvent.emit(row);
  }

  getItemKeys(item: any) {
    return Object.keys(item).filter(key => !this.config.excludeFields.includes(key));
  }

}
