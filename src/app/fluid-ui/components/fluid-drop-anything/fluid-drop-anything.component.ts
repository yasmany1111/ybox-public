import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-fluid-drop-anything',
  templateUrl: './fluid-drop-anything.component.html',
  styleUrls: ['./fluid-drop-anything.component.scss']
})
export class FluidDropAnythingComponent implements OnInit {
  public preventBodyDrop = true;
  public isHoveringSomething = false;

  public loadedItems = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  @HostListener('drop', ['$event'])
  public droppedSomething(ev) {
    this.isHoveringSomething = false;
    ev.preventDefault();

    const droppedItems = ev.dataTransfer.items;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < droppedItems.length; i++) {
      // webkitGetAsEntry is where the magic happens
      const item = droppedItems[i].webkitGetAsEntry();
      if (item) {
        this.traverseFileTree(item);
      }
    }
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isHoveringSomething = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent) {
    this.isHoveringSomething = false;
  }

  @HostListener('body:dragover', ['$event'])
  public onBodyDragOver(event: DragEvent) {
    if (this.preventBodyDrop) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('body:drop', ['$event'])
  public onBodyDrop(event: DragEvent) {
    if (this.preventBodyDrop) {
      event.preventDefault();
    }
  }

  public removeFile(file) {
    this.loadedItems = this.loadedItems.filter((f) => f.name !== file.name);
    this.cdRef.detectChanges();
  }

  public async downloadFile(file: File) {
    const b = await file.arrayBuffer();
    var blob = new Blob([b], { type: 'application/png' });
    var objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl);
  }

  private traverseFileTree(item, path = '') {
    path = path || '';
    if (item.isFile) {
      // Get file
      item.file((file: File) => {
        if (!this.loadedItems.find((f) => f.name === file.name)) {
          this.loadedItems = [...this.loadedItems, file];
          this.cdRef.detectChanges();
        }
      });

      return;
    }

    if (item.isDirectory) {
      // Get folder contents
      const dirReader = item.createReader();

      dirReader.readEntries((entries) => {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < entries.length; i++) {
          this.traverseFileTree(entries[i], path + item.name + '/');
        }
      });
    }
  }

  private download(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
