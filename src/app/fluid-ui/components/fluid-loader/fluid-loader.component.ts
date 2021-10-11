import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fluid-loader',
  templateUrl: './fluid-loader.component.html',
  styleUrls: ['./fluid-loader.component.scss'],
})
export class FluidLoaderComponent implements OnInit {
  @Input()
  public isPartial = false;

  constructor() {}

  ngOnInit(): void {}
}
