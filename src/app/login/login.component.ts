import { Component, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
// import { AuthenticationService } from "app/services/authentication.service";
import { finalize, first } from "rxjs/operators";
import { AppComponentBase } from "shared/app-component-base";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent extends AppComponentBase implements OnInit {
  profileForm: FormGroup;
  returnUrl: string;
  loading = false;
  error = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    injector: Injector
  ) {
    super(injector);
    this.profileForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.loading = true;
    this.authenticationService
      .login(this.profileForm.value.email, this.profileForm.value.password)
      .pipe(
        first(),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.error = error;
          this.showMessage("Eror!", error.error.message, "error");
        }
      );
  }
}
