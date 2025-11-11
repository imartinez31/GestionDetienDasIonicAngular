import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  register(user: User): boolean {
    const users = this.storageService.getUsers();
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.username === user.username)) {
      return false;
    }

    // Generar ID único
    user.id = this.generateId();
    users.push(user);
    this.storageService.saveUsers(users);
    
    // Auto-login después del registro
    this.storageService.setCurrentUser(user);
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.storageService.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      this.storageService.setCurrentUser(user);
      return true;
    }
    
    return false;
  }

  logout(): void {
    this.storageService.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.storageService.getCurrentUser() !== null;
  }

  getCurrentUser(): User | null {
    return this.storageService.getCurrentUser();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

