import { Component, Input} from '@angular/core';
import { TabControlService } from '../../shared/tab-control.service';

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css']
})
export class FolderViewComponent {

  @Input() folder: object;

  display: boolean = true;

  constructor(private tabControlService: TabControlService) {
  }

  fileSelected(event, file) {
    this.tabControlService.createTab(file.fileName);
  }

  toggleDisplay() {
    this.display = !this.display;
  }

}

