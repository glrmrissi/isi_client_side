import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsiApiService, RepoInfo } from '../../services/isi-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
})
export class HomePage implements OnInit {
  private api = inject(IsiApiService);
  private router = inject(Router);

  repos = signal<RepoInfo[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.api.listRepos().subscribe({
      next: repos => { this.repos.set(repos); this.loading.set(false); },
      error: () => {
        this.error.set('Could not connect to isi server at localhost:3000.');
        this.loading.set(false);
      },
    });
  }

  open(repo: RepoInfo) {
    this.router.navigate([repo.name]);
  }
}
