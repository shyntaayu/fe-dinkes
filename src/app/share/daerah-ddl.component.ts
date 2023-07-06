import {
  Component,
  OnInit,
  Injector,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { DaerahService } from "app/services/daerah.service";
import { AppComponentBase } from "shared/app-component-base";
const noop = () => {};
@Component({
  selector: "daerah-ddl",
  template: `<div [busyIf]="isLoading">
    <div class="example-full-width">
      <p-multiSelect
        [options]="daerah"
        [(ngModel)]="inputValue"
        optionLabel="daerah_name"
        optionValue="daerah_name"
        [style]="{ width: '100%' }"
        [panelStyle]="{ width: '100%' }"
        defaultLabel="Pilih Daerah"
        display="chip"
      >
        <ng-template pTemplate="header">
          <div class="checkbox-all-text">Select All</div>
        </ng-template></p-multiSelect
      >
    </div>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DaerahDdlComponent,
      multi: true,
    },
  ],
})
export class DaerahDdlComponent
  extends AppComponentBase
  implements OnInit, ControlValueAccessor
{
  private innerValue: any = "";
  daerah;

  onChange: (value: string) => void;

  @Input() isDisabled: boolean = false;
  @Input() selectedDaerah: number = undefined;

  isLoading = false;

  private onTouchedCallback: () => void = noop;

  constructor(private _daerahService: DaerahService, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    let self = this;
    self.isLoading = true;
    this._daerahService.getAllDaerah().subscribe(
      (result) => {
        this.daerah = result;
        self.isLoading = false;
      },
      (err) => {
        self.isLoading = false;
        console.error(err);
        this.showMessage("Eror!", err.message, "error");
      }
    );
  }

  ngOnChanges(): void {
    this.selectedDaerah = this.selectedDaerah;
  }

  get inputValue(): any {
    return this.innerValue;
  }

  set inputValue(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  displayFn(value?: number) {
    return value
      ? this.daerah.find((_) => _.daerah_name === value).daerah_name
      : undefined;
  }
}
