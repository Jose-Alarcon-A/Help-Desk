import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error404',
  imports: [MatButtonModule],
  templateUrl: './error404.html',
  styleUrl: './error404.css',
})
export class Error404 {

  constructor(private router: Router) {}

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

}
