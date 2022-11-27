import { NgModule } from '@angular/core';
import {SumPipe} from "./pipes/sum.pipe";



@NgModule({
  declarations: [SumPipe],
  imports: [
  ],
  exports: [SumPipe]
})
export class CommonModule { }
