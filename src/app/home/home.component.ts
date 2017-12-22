import {Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";
import {Car} from "./car.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cars: Car[];
  electrocars: Car[];
  car: Car;
  electrocar: Car;
  emptyCar: Car;
  activeSlide: number;
  economy: number;
  electroHeight = 25; // initial height
  carHeight = 25;     // initial height
  kmHeight = 43 / 30; // relative height of each km
  imageOpacity = 1;   // initial opacity of image

  constructor(private http: Http) {
    this.activeSlide = 0;
  }

  ngOnInit() {
    this.emptyCar = {
      title: '',
      price: 0,
      price_100: 0,
      img: ''
    };
    Promise.all([this.getCars(), this.getElectrocars()]).then(values => {
      this.cars = values[0].json();
      this.car = this.cars && this.cars.length > 0 ? this.cars[0] : this.emptyCar;
      this.electrocars = values[1].json();
      this.electrocar = this.electrocars && this.electrocars.length > 0 ? this.electrocars[0] : this.emptyCar;
      this.economy = this.car.price_100 - this.electrocar.price_100;
      setTimeout(() => {
        this.checkEconomy();
      }, 2000);
    });
  }

  checkEconomy() {
    this.imageOpacity = 0;
    setTimeout(() => {
      this.imageOpacity = 1;
    }, 300);
    this.economy = this.car.price_100 - this.electrocar.price_100;
    this.electroHeight = this.electrocar.price_100 * this.kmHeight;
    this.carHeight = this.car.price_100 * this.kmHeight;
  }

  nextSlide() {
    this.activeSlide++;
    if ((this.activeSlide + 1) > this.electrocars.length) {
      this.activeSlide = 0;
    }
    this.electrocar = this.electrocars[this.activeSlide];
    this.checkEconomy();
  }

  previousSlide() {
    this.activeSlide--;
    if (this.activeSlide < 0) {
      this.activeSlide = this.electrocars.length - 1;
    }
    this.electrocar = this.electrocars[this.activeSlide];
    this.checkEconomy();
  }

  getCars() {
    return this.http.get(`https://andreykko.github.io/test/cars.json`).toPromise();
  }

  getElectrocars() {
    return this.http.get(`https://andreykko.github.io/test/green_cars.json`).toPromise();
  }

}
