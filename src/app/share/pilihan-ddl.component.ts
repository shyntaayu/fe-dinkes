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
import { AppComponentBase } from "shared/app-component-base";
const noop = () => {};
@Component({
  selector: "pilihan-ddl",
  template: `<div [busyIf]="isLoading">
    <mat-form-field class="example-full-width">
      <mat-label>{{ label }}</mat-label>
      <input
        type="text"
        placeholder="Pilih pilihan"
        aria-label="Number"
        matInput
        [matAutocomplete]="auto"
        [(ngModel)]="inputValue"
      />
      <mat-autocomplete
        (optionSelected)="selectedSmt.emit(inputValue)"
        autoActiveFirstOption
        #auto="matAutocomplete"
        [displayWith]="displayFn.bind(this)"
      >
        <mat-option *ngFor="let option of pilihan" [value]="option.value">
          {{ option.value }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PilihanDdlComponent,
      multi: true,
    },
  ],
})
export class PilihanDdlComponent
  extends AppComponentBase
  implements OnInit, ControlValueAccessor
{
  private innerValue: any = "";
  pilihan;

  onChange: (value: string) => void;

  @Input() isDisabled: boolean = false;
  @Input() label: string = "";
  @Input() selectedPilihan: number = undefined;
  @Output() selectedSmt: EventEmitter<any> = new EventEmitter<any>();

  isLoading = false;

  private onTouchedCallback: () => void = noop;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    let self = this;
    self.isLoading = true;
    this.pilihan = [
      {
        value: "penyakit",
      },
      {
        value: "daerah",
      },
      {
        value: "tahun",
      },
    ];
    self.isLoading = false;
  }

  ngOnChanges(): void {
    this.selectedPilihan = this.selectedPilihan;
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
      ? this.pilihan.find((_) => _.value === value).value
      : undefined;
  }
}
