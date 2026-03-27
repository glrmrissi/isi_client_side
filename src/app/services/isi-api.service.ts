import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const API = 'http://localhost:3000';

export interface RepoInfo {
  name: string;
  created_at: string;
}

export interface RefInfo {
  name: string;
  hash: string;
}

export interface FileEntry {
  path: string;
  hash: string;
  commit: string;
}

@Injectable({ providedIn: 'root' })
export class IsiApiService {
  private http = inject(HttpClient);

  listRepos(): Observable<RepoInfo[]> {
    return this.http
      .get<{ repos: RepoInfo[] }>(`${API}/repos`)
      .pipe(map(r => r.repos));
  }

  listRefs(repo: string): Observable<RefInfo[]> {
    return this.http
      .get<{ refs: RefInfo[] }>(`${API}/repos/${repo}/refs`)
      .pipe(map(r => r.refs));
  }

  listFiles(repo: string, ref: string): Observable<FileEntry[]> {
    return this.http
      .get<{ files: FileEntry[] }>(`${API}/repos/${repo}/files/${ref}`)
      .pipe(map(r => r.files));
  }

  getFileContent(repo: string, ref: string, path: string): Observable<string> {
    return this.http.get(`${API}/repos/${repo}/files/${ref}/${path}`, {
      responseType: 'text',
    });
  }
}
