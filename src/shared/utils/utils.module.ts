import { NgModule } from "@angular/core";

import { EqualValidator } from "./validation/equal-validator.directive";
import { PasswordComplexityValidator } from "./validation/password-complexity-validator.directive";
import { MinValueValidator } from "./validation/min-value-validator.directive";
import { ButtonBusyDirective } from "./button-busy.directive";
import { AutoFocusDirective } from "./auto-focus.directive";
import { LoadingDirective } from "./busy-if.directive";
import { MomentFormatPipe } from "./moment-format.pipe";

@NgModule({
  providers: [],
  declarations: [
    EqualValidator,
    PasswordComplexityValidator,
    MinValueValidator,
    ButtonBusyDirective,
    AutoFocusDirective,
    LoadingDirective,
    MomentFormatPipe,
  ],
  exports: [
    EqualValidator,
    PasswordComplexityValidator,
    MinValueValidator,
    ButtonBusyDirective,
    AutoFocusDirective,
    LoadingDirective,
    MomentFormatPipe,
  ],
})
export class UtilsModule {}
