import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup-company',
  templateUrl: './signup-company.component.html',
  styleUrl: './signup-company.component.scss',
})
export class SignupCompanyComponent {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder, //injected to build directive forms
    private authService: AuthService, //inject to call the APIs
    private notification: NzNotificationService, //inject to show the messages to the user
    private router: Router //inject to navigate the user
  ) {
    // this.validateForm = this.fb.group(
    //   {
    //     password: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
    //       ],
    //     ],
    //     checkPassword: ['', [Validators.required]],
    //   },
    //   { validators: this.passwordMatchValidator }
    // );
  }

  // // Custom validator to check if passwords match
  // passwordMatchValidator(formGroup: FormGroup) {
  //   const password = formGroup.get('password')?.value;
  //   const checkPassword = formGroup.get('checkPassword')?.value;
  //   return password === checkPassword ? null : { mismatch: true };
  // }

  // Getters for easy access in the template
  // get password() {
  //   return this.validateForm.get('password');
  // }

  // get checkPassword() {
  //   return this.validateForm.get('checkPassword');
  // }

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required]],
    });
  }

  submitForm() {
    this.authService.registerCompany(this.validateForm.value).subscribe(
      (res) => {
        this.notification.success(
          'SUCCESS',
          'Company registered successfully',
          {
            nzDuration: 5000,
          }
        );
        this.router.navigateByUrl('/login');
      },
      (error) => {
        this.notification.error('ERROR', `$(error.error)`, {
          nzDuration: 5000,
        });
      }
    );
  }
}
