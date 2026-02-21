import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  async setToken(token: string) {
    await Preferences.set({ key: 'auth_token', value: token });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'auth_token' });
    return value;
  }

  async isLoggedIn(): Promise<boolean> {
    const { value } = await Preferences.get({ key: 'auth_token' });
    return !!value;
  }

  async logout() {
    await Preferences.remove({ key: 'auth_token' });
  }
}
