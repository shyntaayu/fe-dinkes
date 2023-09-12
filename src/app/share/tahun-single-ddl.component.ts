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
import { TahunService } from "app/services/tahun.service";
import { AppComponentBase } from "shared/app-component-base";
const noop = () => {};
@Component({
  selector: "tahun-single-ddl",
  template: `<div [busyIf]="isLoading">
    <div class="example-full-width">
      <p-dropdown
        [options]="tahun"
        [(ngModel)]="inputValue"
        optionLabel="tahun"
        optionValue="tahun"
        [style]="{ width: '100%' }"
        [panelStyle]="{ width: '100%' }"
        placeholder="Pilih Tahun"
      ></p-dropdown>
    </div>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TahunSingleDdlComponent,
      multi: true,
    },
  ],
})
export class TahunSingleDdlComponent
  extends AppComponentBase
  implements OnInit, ControlValueAccessor
{
  private innerValue: any = "";
  tahun;

  onChange: (value: string) => void;

  @Input() isDisabled: boolean = false;
  @Input() isAwal: boolean = false;
  @Input() selectedTahun: number = undefined;

  isLoading = false;

  private onTouchedCallback: () => void = noop;

  constructor(private _tahunService: TahunService, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    let self = this;
    self.isLoading = true;
    if (this.isAwal) {
      this._tahunService.getAllTahun().subscribe(
        (result) => {
          this.tahun = result;
          self.isLoading = false;
        },
        (err) => {
          self.isLoading = false;
          console.error(err);
          this.showMessage("Eror!", err.message, "error");
        }
      );
    } else {
      const currentYear = new Date().getFullYear() - 2; // Get the current year
      const endYear = currentYear + 10; // Calculate the end year (current year + 10)

      const yearsArray = [];

      for (let year = currentYear + 1; year <= endYear; year++) {
        yearsArray.push({ tahun: year.toString() });
      }

      this.tahun = yearsArray;
      self.isLoading = false;
    }
  }

  ngOnChanges(): void {
    this.selectedTahun = this.selectedTahun;
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
    return value ? this.tahun.find((_) => _.tahun === value).tahun : undefined;
  }
}
