import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AppEnv } from '../models/env.model';
import { Credits, DetailFilm, Genre, RootResponse } from "../models/models";

const URL = (environment as AppEnv).url;
const apiKey = (environment as AppEnv).apiKey;
const header = (environment as AppEnv).header;

@Injectable({
  providedIn: "root",
})
export class MoviesService {
  private popularPages = 0;
  genres: Genre[] = [];

  constructor(private http: HttpClient) { }

  private execQuery<T>(query: string) {
    query = URL + query;
    query += `&api_key=${apiKey}&language=en`;

    return this.http.get<T>(query);
  }

  getFeauture() {
    const t = new Date();
    const lastDay = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
    const m = t.getMonth() + 1;

    let monthStr;

    if (m < 10) {
      monthStr = "0" + m;
    } else {
      monthStr = m;
    }

    const start = `${t.getFullYear()}-${monthStr}-01`;
    const end = `${t.getFullYear()}-${monthStr}-${lastDay}`;

    return this.execQuery<RootResponse>(
      `${header}primary_release_date.gte=${start}&primary_release_date.lte=${end}`
    );
  }

  getPopularities() {
    this.popularPages++;

    const query = `${header}sort_by=popularity.desc&page=${this.popularPages}`;

    return this.execQuery<RootResponse>(query);
  }

  getDetailFilm(id: string) {
    return this.execQuery<DetailFilm>(`/movie/${id}?a=1`);
  }

  getActorsMovie(id: string) {
    return this.execQuery<Credits>(`/movie/${id}/credits?a=1`);
  }

  getSearchMovie(search: string) {
    const query = `/search/movie?query=${search}`;
    return this.execQuery(query);
  }

  loadGenre(): Promise<Genre[]> {
    return new Promise((resolve) => {
      this.execQuery(`/genre/movie/list?a=1`).subscribe((resp: Genre) => {
        this.genres = resp["genres"];
        resolve(this.genres);
      });
    });
  }
}
