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
import { PenyakitService } from "app/services/penyakit.service";
import { AppComponentBase } from "shared/app-component-base";
const noop = () => {};
@Component({
  selector: "penyakit-ddl",
  template: `<div [busyIf]="isLoading">
    <div class="example-full-width">
      <p-multiSelect
        [options]="penyakit"
        [(ngModel)]="inputValue"
        optionLabel="penyakit_name"
        optionValue="penyakit_name"
        [style]="{ width: '100%' }"
        [panelStyle]="{ width: '100%' }"
        defaultLabel="Pilih Penyakit"
        display="chip"
      ></p-multiSelect>
    </div>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PenyakitDdlComponent,
      multi: true,
    },
  ],
})
export class PenyakitDdlComponent
  extends AppComponentBase
  implements OnInit, ControlValueAccessor
{
  private innerValue: any = "";
  penyakit;

  onChange: (value: string) => void;

  @Input() isDisabled: boolean = false;
  @Input() selectedPenyakit: number = undefined;

  isLoading = false;

  private onTouchedCallback: () => void = noop;

  constructor(private _penyakitService: PenyakitService, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    let self = this;
    self.isLoading = true;
    this._penyakitService.getAllPenyakit().subscribe(
      (result) => {
        console.log(result);
        this.penyakit = result;
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
    this.selectedPenyakit = this.selectedPenyakit;
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
      ? this.penyakit.find((_) => _.penyakit_name === value).penyakit_name
      : undefined;
  }
}
