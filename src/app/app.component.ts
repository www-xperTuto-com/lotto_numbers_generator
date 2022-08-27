import {Component, OnInit} from '@angular/core';
import {results} from "./results";
import {ChanceNumberResult} from "./chanceNumberResult";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  inputBigTable = results;
  inputLittleTable = ChanceNumberResult;

  outPutBigTable: Array<{ index: number, result: number }> = [];
  outPutLittleTable: Array<{ index: number, result: number }> = [];

  totalRanges: Array<{ chiffresFinaux: any, chiffreChance: any }> = [];
  chiffresFinaux: any = [];
  chiffreChance: any;
  selectedChanceNumber: any = [];

  constructor() {
  }

  ngOnInit() {
    this.getFullOrder(this.inputBigTable, this.outPutBigTable, 49);
    this.sortOrders(this.outPutBigTable);

    this.getFullOrder(this.inputLittleTable, this.outPutLittleTable, 10, true);
    this.sortOrders(this.outPutLittleTable);
  }

  getFullOrder(input: any, output: any, length: any, single = false) {
    for (let i = 1; i <= length; i++) {
      output.push({index: i, result: 0})
      this.getOrders(i, input, output, single);
    }
  }

  getOrders(index: number, input: any, output: any, single: boolean) {
    if (single) {
      output[index - 1].result += input.filter((x: any) => x === index).length
    } else {
      input.forEach((row: any) => {
        output[index - 1].result += row.filter((x: any) => x === index).length
      })
    }
  }

  sortOrders(table: any) {
    table.sort(this.sortByCount('result'));
  }

  sortByCount(dayProperty: string): Function | any {
    let sortOrder = 1;
    return (previous: any, next: any) => {
      if (previous[dayProperty] == next[dayProperty]) {
        return 0;
      }
      let result = (previous[dayProperty] < next[dayProperty]) ? 1 : -1;

      return result * sortOrder;
    }
  }

  generate() {
    const bigTable = this.getArrayValues(JSON.parse(JSON.stringify(this.outPutBigTable)));
    const littleTable = this.getArrayValues(JSON.parse(JSON.stringify(this.outPutLittleTable)));


    const chiffre_1 = bigTable[this.generateRandomInteger(1, 20) - 1];
    const chiffre_2 = bigTable[this.generateRandomInteger(1, 20) - 1];

    const chiffre_3 = bigTable[this.generateRandomInteger(20, 40) - 1];
    const chiffre_4 = bigTable[this.generateRandomInteger(20, 40) - 1];


    const chiffre_5 = bigTable[this.generateRandomInteger(40, 49) - 1];
    this.chiffresFinaux = [chiffre_1, chiffre_2, chiffre_3, chiffre_4, chiffre_5];

    this.chiffreChance = littleTable[this.generateRandomInteger(1, 6) - 1];
  }

  hasDuplicationInFullRanges(chiffres: any): boolean {
    let hasDuplicationInFullRanges: boolean = false;
    this.inputBigTable.forEach((row: any) => {
      const occurence = row.filter((x: any) => chiffres.includes(x));
      if (occurence.length > 2) {
        hasDuplicationInFullRanges = true;
      }
    })
    return hasDuplicationInFullRanges;
  }

  hasDuplicationInRow(array: []): boolean {
    const count: any = {};
    let hasDuplicationInRow = false;
    for (const element of array) {
      if (count[element]) {
        count[element] += 1;
      } else {
        count[element] = 1;
      }
      if (count[element] > 1) {
        return true;
      }
    }
    return hasDuplicationInRow;
  }

  hasDuplicatedChanceNumber(chanceNumber: any): boolean {
    return this.selectedChanceNumber.includes(chanceNumber);
  }

  generateMultiple(numberTrys: number) {
    let index = 0;
    let ngRange = 0;
    this.totalRanges = [];
    this.selectedChanceNumber = [];
    setInterval(() => {
      setTimeout(() => {
        if (index < 200) {
          this.generate();
          index++;
        } else {
          if (ngRange <= numberTrys) {
            if (!this.hasDuplicationInRow(this.chiffresFinaux) &&
              !this.hasDuplicationInFullRanges(this.chiffresFinaux) &&
              !this.hasDuplicatedChanceNumber(this.chiffreChance)) {
              this.totalRanges.push({
                chiffresFinaux: this.chiffresFinaux.sort((a: any, b: any) => (a > b ? 1 : -1)),
                chiffreChance: this.chiffreChance
              });
              this.selectedChanceNumber.push(this.chiffreChance)
              ngRange++;

            }
            index = 0;
          } else {
            return;
          }
        }
      }, 10)
    })
  }

  generateRandomInteger(min: any, max: any) {
    return Math.floor(min + Math.random() * (max - min + 1))
  }

  getArrayValues(table: Array<any>) {
    let array: any = [];
    table.forEach(row => {
      array.push(row.index);
    })
    return array;
  }
}
