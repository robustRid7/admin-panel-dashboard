import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
// import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  this.loginForm = this.fb.group({
  userId: ['', Validators.required],
  password: ['', Validators.required],
});
  }

 get f() {
  return this.loginForm.controls as { [key: string]: FormControl };
}


  showSnackBar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // auto close after 3s
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }


  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.showSnackBar('Please fill all required fields', 'error');
      return;
    }

    this.loading = true;

    this.api.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.showSnackBar('Login successful ✅', 'success');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.showSnackBar(err.error?.message || 'Login failed ❌', 'error');
      }
    });
  }



}
