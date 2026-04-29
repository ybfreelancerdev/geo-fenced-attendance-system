export const emailValidation = (email:any) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/;
    if (regex.test(email) === true) {
        return true;
    }
    else {
        return false;
    }
}

export const nameValidation = (name:any) => {
    const regex = /^[a-zA-Z ]+$/;
    if (regex.test(name) === true) {
        return true;
    }
    else {
        return false;
    }
}

export const cardnumberValidation = (cardNumber:any) => {
    const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    if (regex.test(cardNumber) === true) {
        return true;
    }
    else {
        return false;
    }
}

export const cvvcodeValidation = (cvv:any) => {
    const regex = /^[0-9]{3,4}$/;
    if (regex.test(cvv) === true) {
        return true;
    }
    else {
        return false;
    }
  }

export function cc_expires_format(string:any) {
    return string.replace(
        /[^0-9]/g, '' // To allow only numbers
    ).replace(
        /^([2-9])$/g, '0$1' // To handle 3 > 03
    ).replace(
        /^(1{1})([3-9]{1})$/g, '0$1/$2' // 13 > 01/3
    ).replace(
        /^0{1,}/g, '0' // To handle 00 > 0
    ).replace(
        /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2' // To handle 113 > 11/3
    );
}