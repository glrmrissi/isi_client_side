import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IsiApiService, RefInfo } from '../../services/isi-api.service';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './branches.html',
})
export class BranchesPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(IsiApiService);

  repo = signal('');
  refs = signal<RefInfo[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const repo = params['repo'];
      this.repo.set(repo);
      this.api.listRefs(repo).subscribe({
        next: refs => { this.refs.set(refs); this.loading.set(false); },
        error: () => { this.error.set(`Repository "${repo}" not found.`); this.loading.set(false); },
      });
    });
  }

  open(ref: RefInfo) {
    this.router.navigate([this.repo(), ref.name]);
  }
}
