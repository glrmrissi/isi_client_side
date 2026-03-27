import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IsiApiService, FileEntry } from '../../services/isi-api.service';

export interface TreeNode {
  name: string;
  fullPath: string;
  type: 'file' | 'dir';
}

@Component({
  selector: 'app-repo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './repo.html',
})
export class RepoPage implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(IsiApiService);

  repo = signal('');
  ref = signal('');
  commitHash = signal('');
  currentPath = signal('');
  selectedFile = signal<string | null>(null);
  fileContent = signal<string | null>(null);
  allFiles = signal<FileEntry[]>([]);
  loading = signal(true);
  fileLoading = signal(false);
  error = signal<string | null>(null);

  treeNodes = computed<TreeNode[]>(() => {
    const prefix = this.currentPath() ? this.currentPath() + '/' : '';
    const seen = new Set<string>();
    const nodes: TreeNode[] = [];

    for (const f of this.allFiles()) {
      if (!f.path.startsWith(prefix)) continue;
      const rest = f.path.slice(prefix.length);
      const parts = rest.split('/');
      const firstName = parts[0];
      if (seen.has(firstName)) continue;
      seen.add(firstName);
      nodes.push({
        name: firstName,
        fullPath: prefix + firstName,
        type: parts.length === 1 ? 'file' : 'dir',
      });
    }

    return nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  });

  breadcrumbs = computed(() =>
    this.currentPath()
      .split('/')
      .filter(Boolean)
      .map((part, i, arr) => ({ name: part, path: arr.slice(0, i + 1).join('/') }))
  );

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.repo.set(params['repo']);
      this.ref.set(params['ref']);
      this.reset();
      this.api.listFiles(params['repo'], params['ref']).subscribe({
        next: files => {
          this.allFiles.set(files);
          if (files.length > 0) this.commitHash.set(files[0].commit.slice(0, 7));
          this.loading.set(false);
        },
        error: () => {
          this.error.set(`Could not load files for "${params['repo']}/${params['ref']}".`);
          this.loading.set(false);
        },
      });
    });
  }

  private reset() {
    this.currentPath.set('');
    this.selectedFile.set(null);
    this.fileContent.set(null);
    this.allFiles.set([]);
    this.loading.set(true);
    this.error.set(null);
  }

  navigate(node: TreeNode) {
    if (node.type === 'dir') {
      this.currentPath.set(node.fullPath);
      this.selectedFile.set(null);
      this.fileContent.set(null);
    } else {
      this.openFile(node.fullPath);
    }
  }

  openFile(path: string) {
    this.selectedFile.set(path);
    this.fileContent.set(null);
    this.fileLoading.set(true);
    this.api.getFileContent(this.repo(), this.ref(), path).subscribe({
      next: content => { this.fileContent.set(content); this.fileLoading.set(false); },
      error: () => { this.fileContent.set('Error loading file.'); this.fileLoading.set(false); },
    });
  }

  goToPath(path: string) {
    this.currentPath.set(path);
    this.selectedFile.set(null);
    this.fileContent.set(null);
  }

  backToTree() {
    this.selectedFile.set(null);
    this.fileContent.set(null);
  }

  lines(): string[] {
    return (this.fileContent() ?? '').split('\n');
  }
}
