import { Component, OnInit } from '@angular/core';
import { asyncLoadScript } from '../async-loader';

@Component({
  selector: 'app-code-showcase',
  templateUrl: './code-showcase.component.html',
  styleUrls: ['./code-showcase.component.scss']
})
export class CodeShowcaseComponent implements OnInit {
  constructor() {
    asyncLoadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.js');
  }

  ngOnInit(): void {}
}
