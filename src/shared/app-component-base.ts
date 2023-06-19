import { Injector } from "@angular/core";
import * as moment from "moment";
import Swal from "sweetalert2";
declare var $: any;

export class ModalProperty {
  edit: boolean;
  id: number;
  name: string;
}

export abstract class AppComponentBase {
  public superLoading: boolean = false;

  utils = {
    toUnique(array: any[]) {
      return array.filter(function (value, index) {
        return array.indexOf(value) === index;
      });
    },

    daysBetween(startPerformance: Date, endPerformance: Date) {
      let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      return Math.round(
        Math.abs(
          (startPerformance.getTime() - endPerformance.getTime()) / oneDay
        )
      );
    },

    forEach(array: any[], fn, context) {
      array.forEach(fn.bind(null, context));
    },

    for_modif(array: any[], fn, context) {
      for (let i = 0; i < array.length; i++) {
        fn(context, array[i], i);
      }
    },

    appendCopiesOfObject(array, object, x) {
      for (let i = 0; i < x; i++) {
        let newObject = Object.assign({}, object);
        array.push(newObject);
      }
    },

    appendCopiesOfObject2(array, arrobj: any[], x) {
      for (let i = 0; i < x; i++) {
        let newObject = Object.assign({}, arrobj[i]);
        array.push(newObject);
      }
    },

    appendCopiesOfObject3(array, arrobj: any[], x, dto) {
      for (let i = 0; i < x; i++) {
        let newObject = Object.assign(new dto(), arrobj[i]);
        array.push(newObject);
      }
    },
  };

  constructor(injector: Injector) {}

  getButtonClassNameFromWord(word: string): string {
    if (!word) return "btn-primary";

    word = word.toLowerCase();

    const primaryWords = ["approve", "save", "submit", "immediately complete"];

    const cancelWords = ["cancel", "stop"];

    const warnWords = ["return", "return to draft"];

    if (primaryWords.some((x) => x === word)) {
      return "btn-primary";
    } else if (warnWords.some((x) => x === word)) {
      return "btn-warning";
    } else if (cancelWords.some((x) => x === word)) {
      return "btn-danger";
    } else {
      return "btn-primary";
    }
  }

  getLineAwesomeClassNameFromWord(word: string): string {
    if (!word) return "la-arrow";

    word = word.toLowerCase();

    const primaryWords = ["approve", "save", "submit", "immediately complete"];

    const cancelWords = ["cancel", "stop"];

    const backWords = ["return", "return to draft"];

    if (primaryWords.some((x) => x === word)) {
      return "la-check";
    } else if (cancelWords.some((x) => x === word)) {
      return "la-times";
    } else if (backWords.some((x) => x === word)) {
      return "la-reply";
    } else {
      return "la-arrow";
    }
  }

  //=== Maths ===

  amountToNumber(amount: string): number {
    return parseFloat(amount.toString().replace(/,/g, ""));
  }

  roundTo(n, digits) {
    if (digits === undefined) {
      digits = 0;
    }

    let multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    let test = Math.round(n) / multiplicator;
    return +test.toFixed(digits);
  }

  commaSeparateNumber(number): string {
    return Math.ceil(number)
      .toFixed(0)
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }

  currencyFormattedNumber(
    number,
    thousandsSeparator = ",",
    decimalSeparator = "."
  ): string {
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    return (
      parts.join(decimalSeparator) +
      (parts.length === 1
        ? decimalSeparator + "00"
        : parts[1].length === 1
        ? "0"
        : "")
    );
  }

  daysBetween = function (startDate, endDate) {
    // Convert both dates to milliseconds
    var startDate_ms = startDate.getTime();
    var endDate_ms = endDate.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = endDate_ms - startDate_ms;
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);

    var diff = "";
    if (days != 0) diff += days + " days, ";
    if (hours != 0) diff += hours + " hours, ";
    if (minutes != 0) diff += minutes + " minutes, ";

    diff += seconds + " seconds ";

    return diff;
  };

  r_nilai_TF(n): boolean {
    // ini buat return nilai tak di ketahui bro
    //let a =
    if (n === undefined || n === null || n === "" || n === 0) {
      return false;
    } else {
      return true;
    }
  }

  r_str_kosong(n): string {
    // return array kosong
    if (n === undefined || n === null || n === "" || n === 0) {
      return "";
    } else {
      return n;
    }
  }

  r_tf_cek_arr(arr: any[], v: string) {
    let index = arr.findIndex(
      (x) =>
        eval("x." + v) === "" ||
        eval("x." + v) === undefined ||
        eval("x." + v) === null
    );
    return index > -1 ? false : true;
  }

  //NOTE: This method only cover date with / or - separator
  strToDate(
    date: string,
    format: string = "dd/mm/yyyy",
    isDatetime: boolean = false
  ): Date {
    let separator = date.indexOf("-") != -1 ? "-" : "/";
    let splitDate: string[];
    let formattedDate: Date;
    let splitTime: string = "";

    if (isDatetime) {
      let idxSpace = date.indexOf(" ");
      splitDate = date.substr(0, idxSpace).split(separator);
      splitTime = date.substr(idxSpace);
    } else {
      splitDate = date.split(separator);
    }

    if (format == "dd" + separator + "mm" + separator + "yyyy")
      formattedDate = new Date(
        splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0] + splitTime
      );
    else if (format == "mm" + separator + "dd" + separator + "yyyy")
      formattedDate = new Date(
        splitDate[2] + "-" + splitDate[0] + "-" + splitDate[1] + splitTime
      );
    else
      formattedDate = new Date(
        splitDate[0] + "-" + splitDate[1] + "-" + splitDate[2] + splitTime
      );

    return formattedDate;
  }

  // //NOTE: This method only cover date with / or - separator
  // strToMoment(date: string, format: string = 'dd/mm/yyyy', isDatetime: boolean = false): Moment {
  //     if(date){
  //         let dateInput = moment(this.strToDate(date, format, isDatetime));
  //         return dateInput;
  //     }
  //     else{
  //         return undefined;
  //     }
  // }

  // momentToStr(date: Moment): string {
  //     if(date){
  //         return date.format('DD/MM/YYYY');
  //     }
  //     else{
  //         return null;
  //     }
  // }

  // momentToStrFull(date: Moment): string {
  //     if(date){
  //         return date.format('ddd MMM D YYYY');
  //     }
  //     else{
  //         return null;
  //     }
  // }

  // momentToDateTimeStr(date: Moment): string {
  //     return date.format('DD/MM/YYYY hh:mm:ss A');
  // }

  r_nilai0_TF(n) {
    if (n === undefined || n === null || n === "") {
      return false;
    } else {
      return true;
    }
  }

  r_nilai(n): number {
    // return array kosong
    if (n === undefined || n === null || n === "") {
      return 0;
    } else {
      return n;
    }
  }

  formatNumber(num) {
    num = Math.round(num);
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + ",00";
  }

  formatNum(num) {
    if (!isNaN(num)) {
      if (num % 1 == 0) {
        num = Math.round(num);
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + ",00";
      } else {
        num = num.toFixed(2);
        return this.currencyFormattedNumber(num, ".", ",");
      }
    }
  }

  // Hotfix for unwanted currency-mask behavior by Pedro Castelo Branco
  // Lourenço
  // https://github.com/cesarrew/ng2-currency-mask/issues/93#issuecomment-440600557
  //
  // Currency mask currently does not support

  showNotification(from, align, message, type) {
    // const type = ["", "info", "success", "warning", "danger"];

    const color = Math.floor(Math.random() * 4 + 1);

    $.notify(
      {
        icon: "notifications",
        message: message,
      },
      {
        type: type,
        timer: 4000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }

  showMessage(title, text, icon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      allowOutsideClick: false,
    });
  }

  setStatusMatkul(a) {
    let status = [
      { value: 1, name: "Baru" },
      { value: 2, name: "Ulang" },
      { value: 3, name: "Ganti Nilai" },
    ];
    return status.find((x) => x.value == a).name;
  }

  setTahunMasuk(a) {
    let angkatan = a.substr(0, 2);
    return "20" + +angkatan + "-" + "20" + (+angkatan + 1);
  }

  setPujian(a) {
    let result = "";
    if (a >= 2.76 && a <= 3) {
      result = "Memuaskan";
    } else if (a >= 3.01 && a <= 3.5) {
      result = "Sangat Memuaskan";
    } else if (a >= 3.51 && a <= 4) {
      result = "Pujian (cumlaude)";
    }
    return result;
  }

  setIP(a) {
    let num = a;
    let with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
    return Math.round(with2Decimals * 100) / 100;
  }

  setPercent(a) {
    let num = a;
    let with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return with2Decimals;
  }

  setJenjang(a) {
    let result = "";
    if (a == "S1") {
      result = "Strata 1";
    }
    if (a == "D3") {
      result = "Diploma 3";
    }
    return result;
  }
}
