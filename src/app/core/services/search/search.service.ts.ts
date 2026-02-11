import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {

  private searchTermSubject = new BehaviorSubject<string>(''); // 🔥 valor inicial

  searchTerm$ = this.searchTermSubject.asObservable();

  setSearch(term: string) {
    this.searchTermSubject.next(term);
  }
}
